import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Product from '@/models/product.model';

export async function POST(req, { params }) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const productId = params.id;
  const { rating, comment } = await req.json();

  if (!rating || !comment) {
    return NextResponse.json({ message: 'Rating and comment are required' }, { status: 400 });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Check if the user has already reviewed the product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === session.user.id
    );

    if (alreadyReviewed) {
      return NextResponse.json({ message: 'You have already reviewed this product' }, { status: 400 });
    }

    const review = {
      user: session.user.id,
      name: session.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    return NextResponse.json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Review error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
