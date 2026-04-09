<template>
  <footer class="site-footer mt-20">
    <div class="site-container py-14">
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 class="text-xl font-extrabold text-slate-50">Pine Tar Sports Fund</h3>
          <p class="mt-3 text-sm text-slate-400">
            Structured deck workflows for investor raises, sponsorship campaigns, lender packages, and municipality partnerships.
          </p>
        </div>

        <div>
          <h4 class="footer-title">Explore</h4>
          <ul class="footer-links">
            <li><NuxtLink to="/">Home</NuxtLink></li>
            <li><NuxtLink to="/investments">Investments</NuxtLink></li>
            <li><NuxtLink to="/about">About</NuxtLink></li>
            <li><NuxtLink to="/contact">Contact</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">Investor Relations</h4>
          <ul class="footer-links">
            <li><a href="mailto:contact@pinetarsportsfund.com">contact@pinetarsportsfund.com</a></li>
            <li>Investor, sponsor, lender, and municipality requests</li>
            <li>Typical response within one business day</li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">Legal</h4>
          <ul class="footer-links">
            <li>Private offering materials available after qualification</li>
            <li>Past results do not guarantee future returns</li>
          </ul>
        </div>
      </div>

      <div class="mt-12 border-t border-white/10 pt-6 text-sm text-slate-500 flex flex-col sm:flex-row sm:justify-between gap-2">
        <p>&copy; 2026 Pine Tar Sports Fund. All rights reserved.</p>
        <p>Built for structured sports fundraising and partner storytelling.</p>
      </div>
    </div>
  </footer>
</template>
