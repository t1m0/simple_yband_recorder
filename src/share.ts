export function shareLocal(fileName: string, file: File) {
    if ('share' in navigator) {
        shareFile(file, fileName)
    } else {
        download(file, fileName)
    }
}

function shareFile(file: File, fileName: string) {
    navigator.share({
        title: `Sharing ${fileName}`,
        files: [file],
    }).then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));

}

function download(file: File, fileName: string) {
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(file);
    elem.download = fileName;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
}
