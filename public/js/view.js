/* global PHOTO_URL, LABEL_DATA */

$(() => {
  const photoContainer = $('#photo-container');
  const img = $('<img>').css({ display: 'none' }).attr('src', PHOTO_URL);

  const showImage = () => {
    photoContainer.addClass('loaded');
    img.css({ display: '' });
  };

  const drawBoundryBoxes = () => {
    const image = img[0]; // jquery is weird
    const imageWidth = Math.max(image.naturalWidth, image.width);
    const imageHeight = Math.max(image.naturalHeight, image.height);

    for(let label of LABEL_DATA) {
      if(label.Instances.length > 0) {
        for (var i = 0; i < label.Instances.length; i++) {
          const instance = label.Instances[i];
          const box = instance.BoundingBox;
          const boundry = $('<div class="boundry">');

          boundry.css({
            left:   (imageWidth * box['Left']) + 'px',
            top:    (imageHeight * box['Top']) + 'px',
            width:  (imageWidth * box['Width']) + 'px',
            height: (imageHeight * box['Height']) + 'px'
          });

          boundry.attr({
            title:            label['Name'],
            'data-label-idx': i,
            'data-toggle':    'tooltip',
            'data-placement': 'bottom'
          });

          boundry.on('mouseover', (e) => {
            const target = e.currentTarget;
            const label = $(target).attr('data-original-title');
            const idx = $(target).attr('data-label-idx');
            const tr = $(`tr[data-label='${label}'][data-label-idx='${idx}']`);

            tr.addClass('table-active');
          });

          boundry.on('mouseout', (e) => {
            const target = e.currentTarget;
            const label = $(target).attr('data-original-title');
            const idx = $(target).attr('data-label-idx');
            const tr = $(`tr[data-label='${label}'][data-label-idx='${idx}']`);

            tr.removeClass('table-active');
          });

          photoContainer.append(boundry);
        }
      }
    }
  }

  const initTooltips = () => {
    $('[data-toggle="tooltip"]').tooltip();
  };

  img.on('load', () => {
    showImage();
    drawBoundryBoxes();
    initTooltips();
  });

  photoContainer.append(img);

  $('tr').on('mouseover', (e) => {
    const label = $(e.currentTarget).attr('data-label');
    const idx = $(e.currentTarget).attr('data-label-idx');
    const boundry = $($(`[data-original-title='${label}'][data-label-idx='${idx}']`)[0]);

    boundry.addClass('hover');
    boundry.tooltip('show');
  });

  $('tr').on('mouseout', () => {
    const all = $('.boundry');

    all.removeClass('hover');
    all.tooltip('hide');
  });
});
