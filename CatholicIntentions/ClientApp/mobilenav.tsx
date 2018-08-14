var $: any = (require("cash-dom") as any).default;

// CSS transitions because we don't need
// Bootstrap just for the drop down
// https://css-tricks.com/using-css-transitions-auto-dimensions/
$(document).ready(function () {
    var ready = true;
    var collapseSection = function (element: any) {
        ready = false;
        var sectionHeight = element.scrollHeight;
        var elementTransition = element.style.transition;
        element.style.transition = "";

        requestAnimationFrame(function () {
            element.style.height = sectionHeight + "px";
            element.style.transition = elementTransition;

            requestAnimationFrame(function () {
                element.style.height = "0px";
                ready = true;
            });
        });

        element.setAttribute("data-collapsed", "true");
    };
    var expandSection = function (element: any) {
        ready = false;
        var sectionHeight = element.scrollHeight;
        element.style.height = sectionHeight + "px";

        var pointer = function (e: any) {
            element.removeEventListener("transitionend", pointer);
            element.style.height = "auto";
            ready = true;
        };
        element.addEventListener("transitionend", pointer);

        element.setAttribute("data-collapsed", "false");
    };
    $(".navbar-toggle").on("click", function (e: any) {

        var toAlter = $(".navbar-collapse");
        var state = toAlter.attr("data-collapsed");

        if (state === "true" && ready) {
            expandSection(toAlter[0]);
            toAlter.attr("data-collapsed", "false");
            toAlter.attr("aria-hidden", "false");
        } else if (state === "false" && ready) {
            collapseSection(toAlter[0]);
            toAlter.attr("aria-hidden", "true");
        }
    });

    // Click handler to close on body click
    $("body").on("click", function (e: any) {
        var toAlter = $(".navbar-collapse");
        var state = toAlter.attr("data-collapsed");

        if (state === "false" && ready) {
            collapseSection(toAlter[0]);
            toAlter.attr("aria-hidden", "true");
        }
    });

    // Change aria element on mobile
    let defaultAria = window.innerWidth >= 768 ? "false" : "true";
    $(".navbar-collapse").attr("aria-hidden", defaultAria);   
});