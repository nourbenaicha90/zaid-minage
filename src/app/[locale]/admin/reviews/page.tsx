import { prisma } from "@/lib/prisma";
import { ReviewsManager } from "@/components/admin/reviews-manager";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: { product: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl mb-6">Reviews</h1>
      <ReviewsManager
        initialReviews={reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          isApproved: r.isApproved,
          isVerified: r.isVerified,
          productName: r.product.nameFr,
          customerName: r.user.name,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
