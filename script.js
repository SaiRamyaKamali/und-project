// Define Global Variables
const postsContainer = document.getElementById("posts-container");
const searchInput = document.getElementById("search");
const spinner = document.getElementById("loading-spinner");
let allPosts = [];
let currentPage = 1;
const postsPerPage = 10;

// Helper Function to Format Dates
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
}

// Function to Fetch Posts
async function fetchPosts() {
    const baseUrl = "https://apps.und.edu/demo/public/index.php/post";
    const today = new Date();

    spinner.style.display = "block";

    try {
        for (let i = 0; i < 3; i++) {
            const from = new Date(today);
            from.setDate(today.getDate() - i * 3 - 2);
            const to = new Date(from);
            to.setDate(from.getDate() + 2);

            const response = await fetch(
                `${baseUrl}?from=${from.toISOString().split("T")[0]}&to=${to.toISOString().split("T")[0]}`
            );
            const data = await response.json();
            allPosts = [...allPosts, ...data];
        }

        displayPosts(allPosts);
        setupPaginationWithPlugin(allPosts);
    } catch (error) {
        console.error("Error fetching posts:", error);
    } finally {
        spinner.style.display = "none";
    }
}

// Function to Display Posts
function displayPosts(posts) {
    postsContainer.innerHTML = "";

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    if (posts.length === 0) {
        postsContainer.innerHTML = "<p class='no-posts'>No Posts Found!!</p>";
        return;
    }
    
    paginatedPosts.forEach((post) => {
        const formattedDate = formatDate(post.date);
        const postCard = `
        <div class="post-card">
            <div class="post-image">
                <img src="${post.image}" alt="${post.author}'s image"/>
                <div class="post-image-content">
                    <small style="color:#FF671F">${post.author}</small>
                    <small style="color:#AEAEAE">${post.location}</small>
                    <small style="color:#AEAEAE">${formattedDate}</small>
                </div>
            </div>
            <div class="post-content">
                <p>${post.message}</p>
            </div>
            <div class="post-meta">
                <span><i class="fas fa-heart" style="color: red;"></i> ${post.likes}</span>
                <span><i class="fas fa-retweet" style="color: blue;"></i> ${post.reposts}</span>
            </div>
        </div>`;
        postsContainer.innerHTML += postCard;
    });
}

// Function to Setup Pagination Using jquery Plugin
function setupPaginationWithPlugin(posts) {
    const totalPages = Math.ceil(posts.length / postsPerPage);

    if (totalPages === 0) {
        $('#pagination-demo').html('');
        return;
    }

    $('#pagination-demo').twbsPagination('destroy');

    $('#pagination-demo').twbsPagination({
        totalPages: totalPages,
        visiblePages: 5,
        onPageClick: function (event, page) {
            currentPage = page;
            displayPosts(posts);
        }
    });
}

// Event Listener for Search Input
searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredPosts = allPosts.filter((post) =>
        post.message.toLowerCase().includes(searchTerm) ||
        post.author.toLowerCase().includes(searchTerm)
    );
    displayPosts(filteredPosts);
    setupPaginationWithPlugin(filteredPosts);
});

// Fetch Posts on Initialization
fetchPosts();


// Hamburger Menu Toggle
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector("header nav");
const body = document.body;

menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    menuToggle.classList.toggle("open");
    body.classList.toggle('menu-open');
});


