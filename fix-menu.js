$(document).ready(function() {
    // Fix for OPIT REST and ECR Integration submenu not opening
    $('.toc-h1.toc-link').on('click', function(e) {
        var $this = $(this);
        var $submenu = $this.siblings('.toc-list-h2');

        if ($submenu.length > 0) {
            // Prevent default only for h1 items with submenus
            e.preventDefault();

            // Close all other submenus
            $('.toc-list-h2').not($submenu).slideUp(150).removeClass('active');
            $('.toc-h1.toc-link').not($this).removeClass('active-parent');

            // Toggle this submenu
            if ($submenu.hasClass('active')) {
                $submenu.slideUp(150).removeClass('active');
                $this.removeClass('active-parent');
            } else {
                $submenu.slideDown(150).addClass('active');
                $this.addClass('active-parent');
            }
        }
    });

    // Handle h2 submenu clicks - just close other h1 submenus
    $('.toc-h2.toc-link').on('click', function(e) {
        var $parentLi = $(this).closest('li').parent().closest('li');
        var $parentH1 = $parentLi.find('> .toc-h1.toc-link');
        var $currentSubmenu = $parentLi.find('> .toc-list-h2');

        // Keep current submenu open and mark parent as active
        $('.toc-list-h2').not($currentSubmenu).slideUp(150).removeClass('active');
        $('.toc-h1.toc-link').not($parentH1).removeClass('active-parent');

        if ($currentSubmenu.length > 0) {
            $currentSubmenu.addClass('active');
            $currentSubmenu.addClass('active');
            $parentH1.addClass('active-parent');
        }
    });
});
