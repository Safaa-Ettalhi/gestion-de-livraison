export const render404 = () => {
    document.getElementsByTagName('body').innerHTML = `404 sorry`
    return 
}



document.addEventListener('DOMContentLoaded', () => {
  render404();
});


