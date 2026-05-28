document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const typingTarget = document.getElementById('typing');
  const roles = [
    'banking systems architecture',
    'RPGLE & DB2/400 modernization',
    'high-availability batch processing',
    'cloud-era IBM i consulting'
  ];

  if (typingTarget) {
    if (prefersReducedMotion) {
      typingTarget.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const type = () => {
        const currentRole = roles[roleIndex];
        typingTarget.textContent = currentRole.slice(0, charIndex);

        if (!deleting && charIndex < currentRole.length) {
          charIndex += 1;
        } else if (deleting && charIndex > 0) {
          charIndex -= 1;
        } else {
          deleting = !deleting;
          if (!deleting) {
            roleIndex = (roleIndex + 1) % roles.length;
          }
        }

        const delay = deleting ? 40 : 70;
        setTimeout(type, deleting && charIndex === 0 ? 600 : delay);
      };
      type();
    }
  }

  const reveals = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('[data-count]');

  const animateCounter = (element) => {
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || '';
    const duration = 1400;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      element.textContent = `${value}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  if (prefersReducedMotion) {
    reveals.forEach((section) => section.classList.add('reveal--visible'));
    counters.forEach((counter) => {
      counter.textContent = `${counter.dataset.count || 0}${counter.dataset.suffix || ''}`;
    });
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    reveals.forEach((section) => observer.observe(section));

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item) => {
    item.addEventListener('click', () => {
      item.classList.toggle('is-open');
    });
  });

  const cursor = document.getElementById('cursor');
  if (cursor && !window.matchMedia('(pointer: coarse)').matches) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    const offset = 14;

    window.addEventListener('mousemove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    });

    const render = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      cursor.style.transform = `translate3d(${currentX - offset}px, ${currentY - offset}px, 0)`;
      requestAnimationFrame(render);
    };

    render();

    const interactive = document.querySelectorAll(
      'a, button, .chip, .project-card, .timeline-item, input, textarea'
    );
    interactive.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor--active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--active'));
    });
  }

  const canvas = document.getElementById('matrix');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    const fontSize = 16;
    const chars = ['0', '1'];
    let columns = 0;
    let drops = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    let lastTime = 0;
    const draw = (time) => {
      if (time - lastTime < 50) {
        requestAnimationFrame(draw);
        return;
      }
      lastTime = time;
      ctx.fillStyle = 'rgba(2, 6, 23, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(96, 165, 250, 0.35)';
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      drops.forEach((y, index) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = index * fontSize;
        ctx.fillText(text, x, y);
        if (y > canvas.height && Math.random() > 0.975) {
          drops[index] = 0;
        } else {
          drops[index] = y + fontSize;
        }
      });
      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }
});
