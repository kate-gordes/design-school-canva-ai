import { signal } from '@preact/signals-react';

// Default Jacaranda RSVP page HTML
const DEFAULT_HTML = `<!doctype html>
<html lang="en">
 <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jacaranda Opening Party - RSVP</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Mulish:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    body { box-sizing: border-box; }
    .font-display { font-family: 'Cormorant Garamond', serif; }
    .font-body { font-family: 'Mulish', sans-serif; }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
    .animate-delay-1 { animation-delay: 0.1s; }
    .animate-delay-2 { animation-delay: 0.2s; }
    .animate-delay-3 { animation-delay: 0.3s; }
    .animate-float { animation: float 3s ease-in-out infinite; }
    .input-focus:focus { box-shadow: 0 0 0 3px rgba(91, 125, 124, 0.1); }
    .rsvp-card { backdrop-filter: blur(10px); }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .success-message { animation: slideIn 0.4s ease-out; }
  </style>
 </head>
 <body class="font-body" style="background-color: #E9E1FB; color: #5B7D7C;">
  <div id="app" class="w-full">
   <!-- Navigation -->
   <nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style="background-color: rgba(233, 225, 251, 0.95);">
    <div class="max-w-7xl mx-auto px-6 py-4">
     <div class="flex items-center gap-3">
      <svg class="w-10 h-10" viewBox="0 0 40 40" fill="none">
       <circle cx="20" cy="20" r="18" stroke="#5B7D7C" stroke-width="1.5"/>
       <path d="M20 8 C15 14, 12 20, 20 32 C28 20, 25 14, 20 8" fill="#5B7D7C" opacity="0.3"/>
       <path d="M20 10 C17 15, 15 20, 20 30" stroke="#5B7D7C" stroke-width="1.5" fill="none"/>
       <path d="M14 16 Q20 14, 26 16" stroke="#5B7D7C" stroke-width="1" fill="none"/>
       <path d="M13 22 Q20 19, 27 22" stroke="#5B7D7C" stroke-width="1" fill="none"/>
      </svg>
      <span class="font-display text-2xl font-semibold" style="color: #5B7D7C;">Jacaranda Seedling Co.</span>
     </div>
    </div>
   </nav>

   <!-- Hero Section -->
   <section class="relative flex items-center justify-center pt-20 pb-20">
    <div class="absolute inset-0 overflow-hidden -z-10">
     <div class="absolute inset-0" style="background: linear-gradient(135deg, rgba(233, 225, 251, 0.85) 0%, rgba(212, 200, 240, 0.85) 100%);"></div>
    </div>
    <div class="relative max-w-4xl mx-auto px-6 text-center">
     <div class="animate-fade-in-up">
      <p class="text-sm tracking-[0.3em] uppercase mb-4 font-body" style="color: #5B7D7C;">You're Invited</p>
      <h1 id="event-title" class="font-display text-6xl md:text-7xl font-medium leading-tight mb-6" style="color: #5B7D7C;">Jacaranda Opening Party</h1>
      <p id="event-description" class="text-xl mb-12 opacity-80 max-w-2xl mx-auto leading-relaxed">Join us for a magical evening celebrating the launch of Jacaranda Seedling Co. Enjoy refreshments, meet our team, and discover the beauty of purple blooms.</p>
     </div>
     <!-- Event Details Cards -->
     <div class="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in-up animate-delay-1">
      <div class="p-8 rounded-3xl rsvp-card" style="background-color: rgba(255, 255, 255, 0.6); border: 1px solid rgba(91, 125, 124, 0.2);">
       <div class="text-4xl mb-3">\u{1F4C5}</div>
       <h3 class="font-display text-lg mb-1" style="color: #5B7D7C;">When</h3>
       <p id="event-date-text" class="text-sm opacity-80">June 15, 2024</p>
      </div>
      <div class="p-8 rounded-3xl rsvp-card" style="background-color: rgba(255, 255, 255, 0.6); border: 1px solid rgba(91, 125, 124, 0.2);">
       <div class="text-4xl mb-3">\u{1F554}</div>
       <h3 class="font-display text-lg mb-1" style="color: #5B7D7C;">Time</h3>
       <p id="event-time-text" class="text-sm opacity-80">5:00 PM - 9:00 PM</p>
      </div>
      <div class="p-8 rounded-3xl rsvp-card" style="background-color: rgba(255, 255, 255, 0.6); border: 1px solid rgba(91, 125, 124, 0.2);">
       <div class="text-4xl mb-3">\u{1F4CD}</div>
       <h3 class="font-display text-lg mb-1" style="color: #5B7D7C;">Where</h3>
       <p id="event-location-text" class="text-sm opacity-80">The Garden Venue</p>
      </div>
     </div>
    </div>
   </section>

   <!-- RSVP Form Section -->
   <section class="py-24" style="background-color: #5B7D7C;">
    <div class="max-w-2xl mx-auto px-6">
     <div class="text-center mb-12 animate-fade-in-up">
      <h2 id="form-title" class="font-display text-4xl md:text-5xl mb-4" style="color: #E9E1FB;">RSVP Here</h2>
      <p style="color: #E9E1FB;" class="opacity-80">Let us know if you can make it!</p>
     </div>
     <form id="rsvp-form" class="space-y-6 animate-fade-in-up animate-delay-1">
      <div>
       <label for="name" class="block text-sm font-medium mb-3" style="color: #E9E1FB;">Full Name</label>
       <input type="text" id="name" required placeholder="Enter your name" class="w-full px-6 py-4 rounded-2xl focus:outline-none transition-all input-focus" style="background-color: rgba(255,255,255,0.95); color: #5B7D7C; border: 1px solid rgba(233,225,251,0.3);">
      </div>
      <div>
       <label for="email" class="block text-sm font-medium mb-3" style="color: #E9E1FB;">Email Address</label>
       <input type="email" id="email" required placeholder="your@email.com" class="w-full px-6 py-4 rounded-2xl focus:outline-none transition-all input-focus" style="background-color: rgba(255,255,255,0.95); color: #5B7D7C; border: 1px solid rgba(233,225,251,0.3);">
      </div>
      <div>
       <label for="guests" class="block text-sm font-medium mb-3" style="color: #E9E1FB;">Number of Guests (including you)</label>
       <select id="guests" required class="w-full px-6 py-4 rounded-2xl focus:outline-none transition-all input-focus" style="background-color: rgba(255,255,255,0.95); color: #5B7D7C; border: 1px solid rgba(233,225,251,0.3);">
        <option value="">Select number of guests</option>
        <option value="1">1 Guest</option>
        <option value="2">2 Guests</option>
        <option value="3">3 Guests</option>
        <option value="4">4 Guests</option>
        <option value="5">5+ Guests</option>
       </select>
      </div>
      <div>
       <label for="dietary" class="block text-sm font-medium mb-3" style="color: #E9E1FB;">Dietary Restrictions (Optional)</label>
       <textarea id="dietary" placeholder="Let us know about any dietary needs..." class="w-full px-6 py-4 rounded-2xl focus:outline-none transition-all input-focus resize-none" rows="3" style="background-color: rgba(255,255,255,0.95); color: #5B7D7C; border: 1px solid rgba(233,225,251,0.3);"></textarea>
      </div>
      <div id="form-status" class="text-center"></div>
      <button type="submit" id="submit-btn" class="w-full py-4 px-8 font-medium rounded-2xl transition-all hover:scale-105 cursor-pointer" style="background-color: #E9E1FB; color: #5B7D7C;">
       Confirm My RSVP
      </button>
     </form>
    </div>
   </section>

   <!-- RSVPs Section -->
   <section class="py-24">
    <div class="max-w-4xl mx-auto px-6">
     <div class="text-center mb-12">
      <h2 class="font-display text-4xl mb-2" style="color: #5B7D7C;">Guest List</h2>
      <p id="rsvp-count" class="text-lg opacity-70">0 guests confirmed</p>
     </div>
     <div id="rsvp-list" class="space-y-4">
      <div class="text-center py-12 opacity-60">
       <p class="font-body">No RSVPs yet. Be the first to confirm!</p>
      </div>
     </div>
    </div>
   </section>

   <!-- Footer -->
   <footer class="py-12 text-center border-t" style="border-color: rgba(91, 125, 124, 0.2);">
    <div class="max-w-7xl mx-auto px-6">
     <p class="opacity-60 text-sm">\u{00A9} 2024 Jacaranda Seedling Co. Can't wait to see you there! \u{1F338}</p>
    </div>
   </footer>
  </div>

  <script>
    let allRsvps = [];

    function renderRsvpList() {
      const list = document.getElementById('rsvp-list');
      const count = document.getElementById('rsvp-count');
      count.textContent = allRsvps.length === 1 ? '1 guest confirmed' : allRsvps.length + ' guests confirmed';
      if (allRsvps.length === 0) {
        list.innerHTML = '<div class="text-center py-12 opacity-60"><p class="font-body">No RSVPs yet. Be the first to confirm!</p></div>';
      } else {
        list.innerHTML = allRsvps.map(function(rsvp) {
          return '<div class="p-6 rounded-2xl" style="background-color: rgba(91,125,124,0.08); border: 1px solid rgba(91,125,124,0.15);">' +
            '<div class="flex items-start justify-between">' +
              '<div class="text-left">' +
                '<h3 class="font-display text-lg" style="color: #5B7D7C;">' + rsvp.name + '</h3>' +
                '<p class="text-sm opacity-70 mb-2">' + rsvp.guests + ' guest' + (rsvp.guests !== '1' ? 's' : '') + '</p>' +
                (rsvp.dietary && rsvp.dietary !== 'None' ? '<p class="text-sm opacity-60">' + rsvp.dietary + '</p>' : '') +
              '</div>' +
              '<div class="text-2xl">\u2713</div>' +
            '</div>' +
          '</div>';
        }).join('');
      }
    }

    document.getElementById('rsvp-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      var name = document.getElementById('name').value;
      var email = document.getElementById('email').value;
      var guests = document.getElementById('guests').value;
      var dietary = document.getElementById('dietary').value;
      var submitBtn = document.getElementById('submit-btn');
      var formStatus = document.getElementById('form-status');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      submitBtn.style.opacity = '0.6';

      await new Promise(function(r) { setTimeout(r, 800); });

      allRsvps.push({ name: name, email: email, guests: guests, dietary: dietary || 'None', timestamp: new Date().toISOString() });
      renderRsvpList();

      formStatus.innerHTML = '<div class="success-message px-4 py-3 rounded-xl" style="background-color: #E9E1FB; color: #5B7D7C; font-weight: 500;">\u2713 Thank you for confirming! We can\\'t wait to see you!</div>';
      document.getElementById('rsvp-form').reset();

      setTimeout(function() {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm My RSVP';
        submitBtn.style.opacity = '1';
        formStatus.innerHTML = '';
      }, 3000);
    });

    renderRsvpList();
  </script>
 </body>
</html>`;

/** Full HTML content of the interactive page */
export const interactivePageHtml = signal<string>(DEFAULT_HTML);

/** Display title for the header */
export const interactivePageTitle = signal<string>('Jacaranda Opening Party - RSVP');

/** Replace the entire HTML content */
export const setInteractivePageHtml = (html: string): void => {
  interactivePageHtml.value = html;
};

/** Literal string find-and-replace on the HTML content */
export const findAndReplaceHtml = (
  search: string,
  replace: string,
): { success: boolean; count: number } => {
  const current = interactivePageHtml.value;
  if (!current.includes(search)) {
    return { success: false, count: 0 };
  }
  const count = current.split(search).length - 1;
  interactivePageHtml.value = current.split(search).join(replace);
  return { success: true, count };
};
