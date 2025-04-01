import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  // Get the headers
  const headersList = headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with the webhook secret
  const webhookSecret = process.env.WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing webhook secret" },
      { status: 500 }
    );
  }

  // Create a new Svix instance with our secret
  const webhook = new Webhook(webhookSecret);

  let evt;

  // Verify the webhook payload
  try {
    evt = webhook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json(
      { error: "Error verifying webhook" },
      { status: 400 }
    );
  }

  // Connect to database
  await connectToDB();

  // Handle the webhook according to event type
  const eventType = evt.type;

  // Extract user data from the event
  const { id, email_addresses, image_url, username, first_name, last_name } =
    evt.data;

  try {
    switch (eventType) {
      case "user.created": {
        // Create a new user in our database
        const name =
          username ||
          `${first_name || ""} ${last_name || ""}`.trim() ||
          email_addresses[0]?.email_address.split("@")[0];
        const email = email_addresses[0]?.email_address;
        const image = image_url;

        const newUser = new User({
          clerkId: id,
          name,
          email,
          image,
          role: "student", // Default role
        });

        await newUser.save();

        return NextResponse.json({ message: "User created successfully" });
      }

      case "user.updated": {
        // Find and update user in our database
        const name =
          username ||
          `${first_name || ""} ${last_name || ""}`.trim() ||
          email_addresses[0]?.email_address.split("@")[0];
        const email = email_addresses[0]?.email_address;
        const image = image_url;

        const updatedUser = await User.findOneAndUpdate(
          { clerkId: id },
          {
            name,
            email,
            image,
          },
          { new: true }
        );

        if (!updatedUser) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({ message: "User updated successfully" });
      }

      case "user.deleted": {
        // Delete user from our database
        const deletedUser = await User.findOneAndDelete({ clerkId: id });

        if (!deletedUser) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({ message: "User deleted successfully" });
      }

      default:
        return NextResponse.json(
          { message: `Webhook event '${eventType}' is not handled` },
          { status: 200 }
        );
    }
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Error handling webhook" },
      { status: 500 }
    );
  }
}
