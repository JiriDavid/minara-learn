import Image from "next/image";
import Link from "next/link";
import { Star, Clock, BookOpen, BarChart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice, truncateText, convertMinutesToHours } from "@/lib/utils";

const CourseCard = ({ course }) => {
  const {
    id,
    title,
    slug,
    thumbnail,
    price,
    ratings,
    lecturer,
    totalDuration,
    totalLessons,
    level,
    category,
    discount = 0,
    enrollmentCount,
  } = course;

  const discountedPrice =
    discount > 0 ? price - (price * discount) / 100 : price;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={thumbnail || "/images/zimsec.png"}
          alt={title}
          fill
          className="object-cover transition-transform hover:scale-105 duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {discount > 0 && (
          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 m-2 rounded">
            {discount}% OFF
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <p className="text-xs text-white bg-blue-600 inline-block px-2 py-1 rounded">
            {category}
          </p>
        </div>
      </div>

      <CardContent className="flex-grow p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg hover:text-blue-600 transition-colors line-clamp-2">
            <Link href={`/courses/${slug}`}>{title}</Link>
          </h3>
        </div>

        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 space-x-3 mb-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{convertMinutesToHours(totalDuration)}</span>
          </div>
          <div className="flex items-center">
            <BarChart className="h-4 w-4 mr-1" />
            <span>{level}</span>
          </div>
        </div>

        <div className="flex items-center mb-4 text-sm">
          <div className="flex items-center text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 mr-2">{ratings?.average || "New"}</span>
          </div>
          <span className="text-slate-500 dark:text-slate-400">
            ({ratings?.count || 0} reviews)
          </span>
        </div>

        {lecturer && (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            <span>By {lecturer.name}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t p-4 flex justify-between items-center">
        <div className="flex flex-col">
          {discount > 0 ? (
            <>
              <span className="text-lg font-bold text-blue-600">
                {formatPrice(discountedPrice)}
              </span>
              <span className="text-sm line-through text-slate-500">
                {formatPrice(price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-blue-600">
              {price === 0 ? "Free" : formatPrice(price)}
            </span>
          )}
        </div>
        <Link href={`/courses/${slug}`}>
          <Button size="sm" variant="primary">
            View Course
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
