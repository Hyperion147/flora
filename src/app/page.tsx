"use client"

import PlantSearch from '@/app/components/PlantSearch';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen">
      {/* Search Section */}
      <section className="pt-8 sm:pt-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">
              Find Plants
            </h2>
          </div>
          <PlantSearch />
        </div>
      </section>

      <section className="relative flex items-center justify-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href={user ? '/dashboard' : '/login'}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto">
              {user ? 'Go to Dashboard' : 'Start Tracking'}
            </Button>
          </Link>
          <Link href="/map">
            <Button variant="outline" className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto">
              Explore Map
            </Button>
          </Link>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">
            Ready to Start Your Plant Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of plant enthusiasts tracking their green friends
          </p>
          <Link href={user ? '/dashboard' : '/login'}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 text-lg">
              {user ? 'Add Your First Plant' : 'Get Started Today'}
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}