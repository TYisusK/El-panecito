function previewImage(event) {
    const preview = document.getElementById('imagePreview');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        preview.style.backgroundImage = `url(${e.target.result})`;
        preview.style.display = 'block';
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
}
