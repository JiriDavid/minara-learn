#!/usr/bin/env node

/**
 * Migration Script: Clerk to Supabase Auth Migration
 *
 * This script goes through all JavaScript/JSX files in the app directory
 * and updates imports and usages of Clerk's useAuth hook to our custom
 * Supabase useAuth implementation.
 *
 * Usage: node scripts/update-clerk-to-supabase.mjs
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const appDir = path.join(rootDir, "app");

async function findJsJsxFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const res = path.resolve(dir, entry.name);
      if (entry.isDirectory()) {
        return findJsJsxFiles(res);
      } else if (
        entry.isFile() &&
        (res.endsWith(".js") ||
          res.endsWith(".jsx") ||
          res.endsWith(".ts") ||
          res.endsWith(".tsx"))
      ) {
        return res;
      }
      return [];
    })
  );

  return files.flat();
}

async function updateFile(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");

    // Check if file uses Clerk's useAuth
    if (!content.includes("@clerk/nextjs") || !content.includes("useAuth")) {
      return false;
    }

    console.log(`Updating file: ${filePath}`);

    // Update import
    let updatedContent = content.replace(
      /import\s+\{([^}]*useAuth[^}]*)\}\s+from\s+['"]@clerk\/nextjs['"]/g,
      'import { $1 } from "@/lib/auth-context"'
    );

    // If other Clerk imports exist after removing useAuth, maintain them
    updatedContent = updatedContent.replace(
      /import\s+\{\s*(.*?)useAuth(.*?)\s*\}\s+from\s+['"]@clerk\/nextjs['"]/g,
      (match, before, after) => {
        const remainingImports = [before, after]
          .join("")
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i !== "" && i !== "useAuth");

        if (remainingImports.length > 0) {
          return `import { ${remainingImports.join(
            ", "
          )} } from "@clerk/nextjs"`;
        }
        return "";
      }
    );

    // Update usage of isSignedIn
    updatedContent = updatedContent.replace(
      /const\s+\{\s*isSignedIn\s*\}\s*=\s*useAuth\(\)/g,
      "const { user, loading } = useAuth();\n  const isSignedIn = !!user && !loading"
    );

    // Update usage of userId and isLoaded
    updatedContent = updatedContent.replace(
      /const\s+\{\s*userId,\s*isLoaded\s*\}\s*=\s*useAuth\(\)/g,
      "const { user, loading } = useAuth()"
    );

    // Replace isLoaded with !loading in conditionals
    updatedContent = updatedContent.replace(
      /if\s*\(\s*!isLoaded\s*\)/g,
      "if (loading)"
    );
    updatedContent = updatedContent.replace(
      /if\s*\(\s*isLoaded\s*\)/g,
      "if (!loading)"
    );

    // Replace userId with user.id or user check
    updatedContent = updatedContent.replace(
      /if\s*\(\s*!userId\s*\)/g,
      "if (!user)"
    );
    updatedContent = updatedContent.replace(/userId/g, "user?.id");

    // Update redirect paths
    updatedContent = updatedContent.replace(/["']\/sign-in["']/g, '"/login"');
    updatedContent = updatedContent.replace(
      /["']\/sign-up["']/g,
      '"/register"'
    );

    await fs.writeFile(filePath, updatedContent, "utf8");
    return true;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

async function main() {
  try {
    console.log("Finding all JavaScript/JSX files in the app directory...");
    const files = await findJsJsxFiles(appDir);

    console.log(`Found ${files.length} JavaScript/JSX files. Processing...`);

    let updatedCount = 0;
    for (const file of files) {
      const wasUpdated = await updateFile(file);
      if (wasUpdated) {
        updatedCount++;
      }
    }

    console.log(`\nMigration complete. Updated ${updatedCount} files.`);

    console.log(
      "\nReminder: Manual review is still necessary as this script might not catch all cases."
    );
    console.log("The following steps should be done manually:");
    console.log("1. Update server-side API routes using Clerk");
    console.log("2. Review middleware for any Clerk-specific logic");
    console.log("3. Check for Clerk UI components that need to be replaced");
    console.log("4. Update environment variables in .env files");
  } catch (error) {
    console.error("Migration script failed:", error);
  }
}

main();
