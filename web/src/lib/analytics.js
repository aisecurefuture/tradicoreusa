import ReactGA from 'react-ga4'
import posthog from 'posthog-js'

const GA_ID   = import.meta.env.VITE_GA_MEASUREMENT_ID
const PH_KEY  = import.meta.env.VITE_POSTHOG_KEY
const PH_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'
const IS_PROD = import.meta.env.PROD

export function initAnalytics() {
  if (!IS_PROD) return

  if (GA_ID) {
    ReactGA.initialize(GA_ID)
  }

  if (PH_KEY) {
    posthog.init(PH_KEY, {
      api_host: PH_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: true,
    })
  }
}

export function trackPageview(path) {
  if (!IS_PROD) return
  if (GA_ID) ReactGA.send({ hitType: 'pageview', page: path })
  if (PH_KEY) posthog.capture('$pageview', { $current_url: window.location.href })
}

export function trackEvent(category, action, label, value) {
  if (!IS_PROD) return
  if (GA_ID) ReactGA.event({ category, action, label, value })
  if (PH_KEY) posthog.capture(action, { category, label, value })
}

export const events = {
  contactFormSubmit: (type)    => trackEvent('Contact',  'form_submit',    type),
  quoteFormSubmit:   (type)    => trackEvent('Quote',    'form_submit',    type),
  tradeFormSubmit:   ()        => trackEvent('Trade',    'form_submit',    'trade_application'),
  addToCart:         (sku)     => trackEvent('Cart',     'add_to_cart',    sku),
  beginCheckout:     ()        => trackEvent('Checkout', 'begin_checkout', undefined),
  checkoutComplete:  (orderId) => trackEvent('Checkout', 'purchase',       orderId),
  notifySignup:      ()        => trackEvent('Doors',    'notify_signup',  'door_launch'),
  speciesView:       (species) => trackEvent('Hardwood', 'species_view',   species),
  productView:       (sku)     => trackEvent('Products', 'product_view',   sku),
}
