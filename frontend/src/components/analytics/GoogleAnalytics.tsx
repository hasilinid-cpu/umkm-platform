'use client';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// ---------- Track pageviews on route change ----------
function GAPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    window.gtag?.('config', GA_MEASUREMENT_ID, { page_path: url });
  }, [pathname, searchParams]);

  return null;
}

// ---------- Main GA Component ----------
export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            send_page_view: true,
            custom_map: {
              dimension1: 'user_role',
              dimension2: 'membership_type',
              dimension3: 'business_type',
            }
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <GAPageTracker />
      </Suspense>
    </>
  );
}

// ---------- Event tracking helpers ----------
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

type EventParams = Record<string, string | number | boolean>;

function track(eventName: string, params: EventParams = {}) {
  if (typeof window === 'undefined') return;
  if (!window.gtag) return;
  window.gtag('event', eventName, {
    event_category: params.category || 'engagement',
    ...params,
  });
}

// ---- Auth Events ----
export const gaEvents = {
  register: (method = 'email') =>
    track('sign_up', { method, category: 'auth' }),

  login: (method = 'email') =>
    track('login', { method, category: 'auth' }),

  logout: () =>
    track('logout', { category: 'auth' }),

  // ---- Course Events ----
  viewCourse: (courseId: string, courseName: string, category: string) =>
    track('view_item', {
      item_id: courseId,
      item_name: courseName,
      item_category: category,
      content_type: 'course',
      category: 'course',
    }),

  enrollCourse: (courseId: string, courseName: string, price: number) =>
    track('add_to_cart', {
      item_id: courseId,
      item_name: courseName,
      price,
      currency: 'IDR',
      category: 'course',
    }),

  startLesson: (courseId: string, lessonTitle: string) =>
    track('start_lesson', {
      item_id: courseId,
      lesson_title: lessonTitle,
      category: 'learning',
    }),

  completeCourse: (courseId: string, courseName: string) =>
    track('complete_course', {
      item_id: courseId,
      item_name: courseName,
      category: 'achievement',
    }),

  // ---- Product Events ----
  viewProduct: (productId: string, productName: string, price: number) =>
    track('view_item', {
      item_id: productId,
      item_name: productName,
      price,
      currency: 'IDR',
      content_type: 'product',
      category: 'marketplace',
    }),

  buyProduct: (productId: string, productName: string, price: number) =>
    track('purchase', {
      transaction_id: `prod_${Date.now()}`,
      value: price,
      currency: 'IDR',
      items: [{ item_id: productId, item_name: productName, price }],
      category: 'marketplace',
    }),

  // ---- Community Events ----
  createPost: (category: string) =>
    track('create_post', { post_category: category, category: 'community' }),

  addComment: (postId: string) =>
    track('add_comment', { item_id: postId, category: 'community' }),

  // ---- Mentoring Events ----
  viewMentor: (mentorId: string, mentorName: string) =>
    track('view_mentor', { mentor_id: mentorId, mentor_name: mentorName, category: 'mentoring' }),

  bookSession: (mentorId: string, price: number) =>
    track('book_session', {
      mentor_id: mentorId,
      value: price,
      currency: 'IDR',
      category: 'mentoring',
    }),

  // ---- Payment Events ----
  initiatePayment: (type: string, amount: number) =>
    track('begin_checkout', {
      value: amount,
      currency: 'IDR',
      payment_type: type,
      category: 'payment',
    }),

  completePayment: (type: string, amount: number, orderId: string) =>
    track('purchase', {
      transaction_id: orderId,
      value: amount,
      currency: 'IDR',
      payment_type: type,
      category: 'payment',
    }),

  // ---- Membership Events ----
  upgradeMembership: (plan: string, amount: number) =>
    track('subscribe', {
      value: amount,
      currency: 'IDR',
      plan,
      category: 'membership',
    }),

  // ---- Search Events ----
  search: (query: string, section: string) =>
    track('search', { search_term: query, content_type: section, category: 'search' }),

  // ---- Navigation Events ----
  clickCTA: (label: string, location: string) =>
    track('click_cta', { cta_label: label, cta_location: location, category: 'navigation' }),

  // ---- User Properties ----
  setUserProperties: (role: string, membership: string, businessType?: string) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('set', 'user_properties', {
      user_role: role,
      membership_type: membership,
      business_type: businessType || 'unknown',
    });
  },
};
