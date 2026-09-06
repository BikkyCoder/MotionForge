/* ============================================================
   ImagineAI — Razorpay Payment Links

   ⚠⚠⚠ YAHAN APNI CHEEZEIN DAALO ⚠⚠⚠
   1) Razorpay dashboard → Payment Links → har plan ka link banao
   2) Link banate waqt "After payment redirect" me daalo:
        payment-success.html?plan=monthly
        payment-success.html?plan=yearly
        payment-success.html?plan=lifetime
      (hosted site ka pura URL, jaise https://aapkisite.com/payment-success.html?plan=yearly)
   3) Link copy karke neeche LINKS me paste karo
   4) Apna WhatsApp number WHATSAPP me daalo (91XXXXXXXXXX)

   Jab tak link empty hai, buy button demo mode me chalega
   (turant activate — bina paise ke).
   ============================================================ */

window.PAY = {
  LINKS: {
    monthly:  '', // ₹399/month
    yearly:   '', // ₹499/year (launch offer plan)
    lifetime: '', // ₹999 one-time
  },

  WHATSAPP: '91XXXXXXXXXX', // ⚠ apna WhatsApp number (country code ke saath)

  PLAN_INFO: {
    monthly:  { name: 'Monthly Premium',  price: '₹399/month' },
    yearly:   { name: 'Yearly Premium',   price: '₹499/year' },
    lifetime: { name: 'Lifetime Premium', price: '₹999 one-time' },
  },

  /* ---------- Buy button handler ---------- */
  buy(plan) {
    const link = PAY.LINKS[plan];
    if (link) {
      // Real payment — user Razorpay checkout pe jayega,
      // payment ke baad success page pe wapas redirect hoga.
      location.href = link;
      return;
    }

    // Payment link abhi set nahi hua — demo mode (old behaviour)
    const info = PAY.PLAN_INFO[plan] || { name: 'Premium' };
    GEN.setPlan(plan);
    if (typeof closeModal === 'function') closeModal();
    setTimeout(() => showToast(
      '🎉 Demo mode: ' + info.name + ' activated! (Add your Razorpay links in js/payment.js)'
    ), 350);
    setTimeout(() => location.href = 'index.html', 1800);
  },

  /* ---------- Success page ---------- */
  initSuccessPage() {
    const wa = document.getElementById('waSupport');
    if (wa) {
      const num = (PAY.WHATSAPP || '').replace(/[^0-9]/g, '');
      if (num) wa.href = 'https://wa.me/' + num;
    }

    const box = document.getElementById('payStatus');
    if (!box) return; // sirf payment-success.html pe chalta hai

    const q = new URLSearchParams(location.search);
    const plan = q.get('plan');
    const paymentId = q.get('razorpay_payment_id') || q.get('razorpay_payment_link_id') || '';
    const info = PAY.PLAN_INFO[plan];

    if (plan && info) {
      document.getElementById('payPlanName').textContent = info.name;
      document.getElementById('payPlanPrice').textContent =
        info.price + (plan === 'yearly' ? ' + 1 Year FREE 🎁' : '');
      try {
        localStorage.setItem('imagineai_pending_payment', JSON.stringify({
          plan: plan,
          payment_id: paymentId,
          at: new Date().toISOString()
        }));
      } catch (e) { /* private mode — ignore */ }
    }

    if (paymentId) {
      document.getElementById('payId').textContent = paymentId;
      const msg = 'Namaste! 👋 Maine ImagineAI ka plan kharida hai.%0A• Plan: ' +
        (info ? info.name + ' — ' + info.price : 'Premium') +
        '%0A• Payment ID: ' + paymentId +
        '%0APlease activate kijiye. 🙏';
      const num = (PAY.WHATSAPP || '').replace(/[^0-9]/g, '');
      if (num) {
        document.getElementById('payWaBtn').href = 'https://wa.me/' + num + '?text=' + msg;
      }
    } else {
      // Payment abhi process ho raha hai
      document.getElementById('payTitle').textContent = 'Checking your payment…';
      document.getElementById('payNote').innerHTML =
        'Payment abhi process ho raha hai. <b>2-3 second me page refresh</b> kar lo — ya payment ka screenshot WhatsApp pe bhej do.';
      document.getElementById('payIdBox').style.display = 'none';
      document.getElementById('payWaBtn').style.display = 'none';
    }
  }
};

document.addEventListener('DOMContentLoaded', PAY.initSuccessPage);
