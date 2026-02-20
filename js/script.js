$(document).ready(function () {
    let cart = [];

    /* =========================
       LOGIN & PASSWORD TOGGLE
    ==========================*/

    // 1. Password Visibility Toggle
    $("#toggle-password").on("click", function () {
        const passwordInput = $("#password");
        const eyeIcon = $("#eye-icon");
        const isPassword = passwordInput.attr("type") === "password";

        passwordInput.attr("type", isPassword ? "text" : "password");
        
        // Toggle FontAwesome classes
        eyeIcon.toggleClass("fa-eye", !isPassword).toggleClass("fa-eye-slash", isPassword);
    });

    // 2. Consolidated Login Validation
    $("#submit").on("click", function (e) {
        e.preventDefault();

        const email = $("#email").val().trim();
        const pass = $("#password").val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Check if fields are empty
        if (!email || !pass) {
            Swal.fire({
                icon: "warning",
                title: "Incomplete Fields",
                text: "Please fill in both email and password.",
                confirmButtonColor: "#ff7eb9"
            });
            return;
        }

        // Email format validation
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: "error",
                title: "Invalid Email",
                text: "Please enter a valid email address.",
                confirmButtonColor: "#d63384"
            });
            return;
        }

        // Success Animation and Redirect
        Swal.fire({
            icon: "success",
            title: "Welcome ",
            text: "Logging you into Aren Beauty...",
            timer: 1500,
            showConfirmButton: false,
            willClose: () => {
                window.location.href = "home.html";
            }
        });
    });

    /* =========================
       LOGOUT
    ==========================*/
    $("#logout").on("click", function () {
        Swal.fire({
            title: "Logout?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            confirmButtonColor: "#d63384"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "index.html";
            }
        });
    });

    /* =========================
       FILTER SYSTEM
    ==========================*/
    if ($(".product").length > 0) {
        // Initial State: Show Makeup
        $(".product").hide();
        $('.product[data-category="makeup"]').show();
        $('.filter-btn[data-category="makeup"]').addClass("active");

        $(".filter-btn").on("click", function () {
            const selected = $(this).data("category");

            $(".filter-btn").removeClass("active");
            $(this).addClass("active");

            $(".product").hide();
            $(`.product[data-category="${selected}"]`).fadeIn();
        });
    }

    /* =========================
       CART SYSTEM
    ==========================*/
    $("#open-cart").click(() => $("#cart-sidebar").addClass("open"));
    $("#close-cart").click(() => $("#cart-sidebar").removeClass("open"));

    $(document).on("click", ".add-btn", function () {
        const product = $(this).closest(".product");
        const name = product.find(".p-name").text().trim();
        // Extract numbers only for price
        const price = parseInt(product.find(".p-price").text().replace(/[^\d]/g, ""));

        cart.push({ name, price });
        updateCart();
    });

    function updateCart() {
    $("#cart-count").text(cart.length);
    $("#cart-list").empty();

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        $("#cart-list").append(`
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span>${item.name} - ₱${item.price}</span>
                <button class="remove-item" data-index="${index}" style="background:none; border:none; color:#d63384; cursor:pointer; font-size: 1.1rem;">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `);
    });

    $("#total-price").text(total);
}
   
    $(document).on("click", ".remove-item", function () {
        const index = $(this).data("index");
        cart.splice(index, 1);
        updateCart();
    });

    $("#checkout").on("click", function () {
        if (cart.length === 0) {
            Swal.fire("Empty Cart", "Add products first!", "info");
            return;
        }

        Swal.fire("Success", "Order Placed!", "success");
        cart = [];
        updateCart();
        $("#cart-sidebar").removeClass("open");
    });

    /* =========================
       ATTENDANCE / MEMBERSHIP SYSTEM
    ==========================*/
    $("#addBtn").on("click", function () {
        const fn = $("#fn").val().trim();
        const mn = $("#mn").val().trim() || "N/A";
        const ln = $("#ln").val().trim();
        const age = $("#age").val().trim();
        const em = $("#em").val().trim();

        // Basic Validation
        if (!fn || !ln || !age || !em) {
            Swal.fire("Error", "Fill all required fields (*)", "error");
            return;
        }

        // Age Validation
        if (!/^[1-9][0-9]*$/.test(age)) {
            Swal.fire("Invalid Age", "Age must be a positive number", "error");
            return;
        }

        // Email Validation
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!em.match(emailPattern)) {
            Swal.fire("Invalid Email", "Please enter a valid email address.", "error");
            return;
        }

        // Duplicate Check
        let duplicate = false;
        $('#qTable tbody tr').each(function() {
            if ($(this).find('td:eq(4)').text() === em) {
                duplicate = true;
            }
        });

        if (duplicate) {
            Swal.fire("Duplicate Entry", "This email is already a member.", "warning");
            return;
        }
        
        // Append to Table
        $("#qTable tbody").append(`
            <tr>
                <td>${fn}</td>
                <td>${mn}</td>
                <td>${ln}</td>
                <td>${age}</td>
                <td>${em}</td>
            </tr>
        `);

        Swal.fire("Added!", "Member recorded", "success");
        $("#fn, #mn, #ln, #age, #em").val("");
    });
});
