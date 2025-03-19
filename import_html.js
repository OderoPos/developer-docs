$(function () {
      var includes = $('[data-include]')
      $.each(includes, function () {
        var file = 'chapters/' + $(this).data('include')
      $(this).load(file)
    })
  })