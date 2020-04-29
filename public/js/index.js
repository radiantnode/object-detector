/* global moment, MOMENT_DATE_FORMAT */

$(() => {
  const previewLiveContainer = $('#preview-live');
  const previewLiveImage = $('#preview-live-image');
  const previewLoader = $('#preview-loader');
  const captureButton = $('#capture-button');
  const rowContainer = $('#detections-table tbody');

  const disableButton = () => {
    captureButton
      .addClass('disabled')
      .attr('disabled', '')
      .css({ cursor: 'not-allowed' });
  };

  const enableButton = () => {
    captureButton
      .removeClass('disabled')
      .removeAttr('disabled')
      .css({ cursor: '' });
  };

  const hideLive = () => {
    previewLiveContainer.css({ display: 'none' });
  };

  const showLive = () => {
    previewLiveContainer.css({ display: '' });
  };

  const hideLoader = () => {
    previewLoader.css({ display: 'none' });
  };

  const showLoader = () => {
    previewLoader.css({ display: '' });
  };

  const captureStaticImage = () => {
    const img = previewLiveImage[0];

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d');

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0);

    return canvas;
  };

  const appendStaticImageToLoader = (dataUrl) => {
    previewLoader.append($('<img>').attr('src', dataUrl));
  };

  const onLiveImageLoad = () => {
    hideLoader();
    showLive();
  };

  const captureRequest = (blob, success) => {
    $.ajax({
      type: 'POST',
      url: '/manual_capture',
      data: blob,
      contentType: 'image/jpeg',
      processData: false,
      success
    });
  };

  const injectRow = (data) => {
    const row = $('<tr>');
    row.append(`
      <td><a href="/view/${data['id']}">${moment(data['datetime']).format(MOMENT_DATE_FORMAT)}</a></td>
      <td>${data['manual_capture'] ? 'Manual': 'Auto'}</td>
      <td>
        <ul class="list-inline text-muted mb-0">
          ${$.map(data['counts'], (count, name) => `
            <li class="list-inline-item"><strong>${name}:</strong> ${count}</li>
          `).join('')}
        </ul>
      </td>
    `);

    rowContainer.prepend(row);
    row.addClass('highlight');
  };

  const onCaptureButtonClick = (event) => {
    event.preventDefault();

    disableButton();
    const capture = captureStaticImage();
    appendStaticImageToLoader(capture.toDataURL());
    hideLive();
    showLoader();

    capture.toBlob((blob) => {
      captureRequest(blob, (data) => {
        hideLoader();
        showLive();
        enableButton();
        injectRow(data);
        console.log(data);
      });
    });
  };

  previewLiveImage.on('load', onLiveImageLoad);
  captureButton.on('click', onCaptureButtonClick);
});
