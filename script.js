$(document).ready(function () {
  const apiKey = "pub_b508a6a54e204413a9459b4132522d20";
  const newsContainer = $("#newsContainer");
  let darkMode = false;
  let currentNews = []; // Simpan hasil berita untuk pencarian

  // 🔹 Fungsi ambil berita dari API
  function loadNews(category = "teknologi") {
    newsContainer.fadeOut(200, function () {
      newsContainer.html("<p class='text-center'>Memuat berita...</p>").fadeIn(200);
    });

    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${category}&language=id`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.results) {
          currentNews = data.results; // simpan hasil berita
          renderNews(currentNews);
        } else {
          newsContainer.html("<p class='text-center text-danger'>Gagal memuat berita.</p>");
        }
      })
      .catch(() => {
        newsContainer.html("<p class='text-center text-danger'>Terjadi kesalahan koneksi.</p>");
      });
  }

  // 🔹 Fungsi render berita ke DOM dengan efek animasi
  function renderNews(newsArray) {
    newsContainer.fadeOut(200, function () {
      newsContainer.empty();

      if (newsArray.length === 0) {
        newsContainer.html("<p class='text-center text-muted'>Tidak ada berita ditemukan.</p>");
      } else {
        newsArray.slice(0, 6).forEach(article => {
          const image = article.image_url || "assets/img/no-image.jpg";
          const title = article.title || "Tanpa Judul";
          const desc = article.description
            ? article.description.substring(0, 100) + "..."
            : "Tidak ada deskripsi.";
          const link = article.link || "#";

          const card = `
            <div class="col-md-4 mb-4">
              <div class="card h-100 shadow-sm border-0 animate__animated animate__fadeInUp">
                <img src="${image}" class="card-img-top" alt="Berita" onerror="this.src='assets/img/no-image.jpg'">
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">${title}</h5>
                  <p class="card-text">${desc}</p>
                  <a href="${link}" target="_blank" class="btn btn-custom mt-auto">Selengkapnya...</a>
                </div>
              </div>
            </div>`;
          newsContainer.append(card);
        });
      }

      newsContainer.fadeIn(400);
    });
  }

  // 🔹 Klik kategori
  $(".category").on("click", function (e) {
    e.preventDefault();
    const category = $(this).data("category");

    $(".category").removeClass("active");
    $(this).addClass("active");

    loadNews(category);
  });

  // 🔹 Pencarian real-time
  $("#search").on("keyup", function () {
    const keyword = $(this).val().toLowerCase();
    const filtered = currentNews.filter(article => {
      return (
        (article.title && article.title.toLowerCase().includes(keyword)) ||
        (article.description && article.description.toLowerCase().includes(keyword))
      );
    });
    renderNews(filtered);
  });

  // 🔹 Tombol dark/light mode
  $("#toggleMode").on("click", function () {
    darkMode = !darkMode;
    if (darkMode) {
      $("body").removeClass("bg-light").addClass("bg-dark text-white");
      $(".card").addClass("bg-secondary text-white");
      $(this).text("☀️ Light Mode");
    } else {
      $("body").removeClass("bg-dark text-white").addClass("bg-light");
      $(".card").removeClass("bg-secondary text-white");
      $(this).text("🌙 Dark Mode");
    }
  });

  // 🔹 Animasi hover untuk link dummy biar profesional
  $(".nav-link").hover(
    function () {
      $(this).css({ color: "#00e1fd", transition: "0.3s" });
    },
    function () {
      $(this).css({ color: "" });
    }
  );

  // 🔹 Load berita default
  loadNews();
});
