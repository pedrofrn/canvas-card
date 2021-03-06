let canvas, ctx, oldTxt, f, yHeight, background, image;
let content = document.querySelector('div#content');
canvas = document.getElementById('canvas');
let txtTitle = document.getElementById('title');
let txtBody = document.getElementById('textBody');
const downloadLnk = document.querySelector('a#downloadLnk');
let contadorTitle = document.querySelector('div.contadorTitle');
let contadorBody = document.querySelector('div.contadorBody');
let formCard = document.querySelector('div#formCard');
let countClick = 0;

// print instructions on screen 
window.onload = function () {
    formCard.parentNode.insertBefore(instructions(), formCard.nextSibling);
};

// count digited chars
txtTitle.addEventListener('keyup', () => {
    contadorTitle.innerText = txtTitle.value.length === 1 ? txtTitle.value.length + ' caractere' : txtTitle.value.length + ' caracteres';
});

// count digited chars
txtBody.addEventListener('keyup', () => {
    contadorBody.innerText = txtBody.value.length === 1 ? txtBody.value.length + ' caractere' : txtBody.value.length + ' caracteres';
});

const date = new Date();
const dateFormat = (Number(date.getDate()) < 10 ? '0' + Number(date.getDate()) : Number(date.getDate())) + '/' + ((Number(date.getMonth()) + 1) < 10 ? '0' + (Number(date.getMonth()) + 1) : (Number(date.getMonth()) + 1)) + '/' + date.getFullYear();
const time = (date.getHours() < 10 ? '0' + date.getHours() + 'h' : date.getHours() + 'h') + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
const unidade = document.querySelector('select');
unidade.addEventListener('change', () => {
    background = backgroundSelect(unidade.value);
})
const bgImage = new Image;
const link = document.getElementById('link');
const qrImage = new Image;
qrImage.crossOrigin = 'anonymous';
canvas.classList.add('displayNone');

// catch the button click and start the canvas
document.getElementById('generate').addEventListener('click', (ev) => {
    if (txtTitle.value.length > 3 && unidade.value !== '' && txtBody.value.length > 5) {
        let pInstructions = document.querySelector('p.texto');
        pInstructions.style.display = 'none';
        content.classList.add('flexContent');
        ctx = canvas.getContext('2d');
        canvas.width = 1080;
        canvas.height = 1080;
        ctx.fillStyle = '#94d095';
        ctx.drawImage(background, 0, 0);
        
        // run the qr code display
        fetch('https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=' + (link.value !== '' ? link.value : qrUnidades()))
            .then(() => {
                qrImage.src = 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=' + (link.value !== '' ? link.value : qrUnidades());
                qrImage.onload = function () {
                    ctx.drawImage(qrImage, 80, 800);
                };
            })
            .then(() => {
                drawText();
                ctx.fillStyle = '#72bc72';
                ctx.font = `normal 15px Roboto, Tahoma`;
                ctx.fillText('Endere??o:', 80, 1030);
                ctx.fillStyle = '#56e83a';
                ctx.font = `bold 15px Roboto, Tahoma`;
                link.value !== '' ? ctx.fillText(formatLink(link.value), 153, 1030) : linkUnidades();
                canvas.classList.remove('displayNone');

                setTimeout(() => {
                    if (countClick === 0) {
                        canvas.classList.toggle('visivel');
                        downloadLnk.classList.toggle('visivel');
                    }
                    image = canvas.toDataURL('image/jpeg');
                    
                    // display the size of generated file
                    let fileSize = (image.length * (3 / 4)) - (image.substr(image.length - 2) === '==' ? 2 : 1);
                    let spanFileSize = document.querySelector('span.fileSize');
                    spanFileSize.innerText = '(' + (fileSize / 1000).toFixed(0) + ' kB' + ')';
                    countClick++;
                }, 300);
            });
    }
    
    // form fields validation
    if (txtTitle.value.length <= 3) {
        let titleMessage = txtTitle.parentNode.insertBefore(warnValidation('O campo t??tulo deve ter 4 caracteres no m??nimo.'), txtTitle.nextSibling);
        setTimeout(() => { 
            titleMessage.classList.toggle('invisivel');
         }, 4000);
         setTimeout(() => { 
            titleMessage.remove()
         }, 4200);
    }
    if (unidade.value === '') {
        let unidadeMessage = unidade.parentNode.insertBefore(warnValidation('Selecione uma unidade para continuar.'), unidade.nextSibling);
        setTimeout(() => { 
            unidadeMessage.classList.toggle('invisivel');
         }, 4000);
         setTimeout(() => { 
            unidadeMessage.remove()
         }, 4200);
    }
    if (txtBody.value.length <= 5) {
        let bodyMessage = txtBody.parentNode.insertBefore(warnValidation('O corpo do card deve ter mais de 5 caracteres.'), txtBody.nextSibling);
        setTimeout(() => { 
            bodyMessage.classList.toggle('invisivel');
         }, 4000);
         setTimeout(() => { 
            bodyMessage.remove()
         }, 4200);
    }
});

// fill the canvas with text
const drawText = function () {
    ctx.fillStyle = '#72bc72';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#94d095';
    ctx.font = `bold 20px Roboto, Tahoma`;
    ctx.fillText(`C??digo QR`, 300, 910);
    ctx.fillStyle = '#72bc72';
    ctx.font = `normal 18px Roboto, Tahoma`;
    ctx.fillText(`Escaneie o c??digo`, 300, 940);
    ctx.fillText(`de barras ao lado usando`, 300, 965);
    ctx.fillText(`a c??mera do celular.`, 300, 990);
    ctx.direction = 'ltr';
    ctx.textAlign = 'right';
    ctx.font = `normal 18px Roboto, Tahoma`;
    ctx.fillText(`IMAGEM CRIADA ??S ${time} DO DIA ${dateFormat}`, 1000, 80);
    ctx.textAlign = 'start';
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop('0', '#eaffe7');
    gradient.addColorStop('1.0', '#40ff66');
    ctx.fillStyle = gradient;
    consolideText(ctx, txtTitle.value, 80, !txtBody.value ? 400 : 250, 850, 'title');
    ctx.fillStyle = '#c4ebc5';
    consolideText(ctx, txtBody.value, 80, yHeight + 80, txtTitle.value.length > 30 && txtTitle.value.length < 40 ? 920 : 800, 'body');
}

// create field validation element
function warnValidation(message) {
    const warning = document.createElement('div');
    warning.classList.add('warning');
    warning.innerText = message;
    return warning;
}

// bind the value of select with the address shown below the qr
function linkUnidades() {
    ctx.fillStyle = '#56e83a';
    ctx.font = `bold 15px Roboto, Tahoma`;
    if (link.value === '') {
        if (unidade.value === 'ifbaiano') {
            ctx.fillText('www.ifbaiano.edu.br', 153, 1030);
        }
        if (unidade.value === 'alagoinhas') {
            ctx.fillText('alagoinhas.ifbaiano.edu.br', 153, 1030);
        }
        if (unidade.value === 'lapa') {
            ctx.fillText('lapa.ifbaiano.edu.br', 153, 1030);
        }
        if (unidade.value === 'catu') {
            ctx.fillText('catu.ifbaiano.edu.br', 153, 1030);
        }
        if (unidade.value === 'gmb') {
            ctx.fillText('mangabeira.ifbaiano.edu.br', 153, 1030);
        }
        if (unidade.value === 'guanambi') {
            ctx.fillText('guanambi.ifbaiano.edu.br', 153, 1030);
        }
        if (unidade.value === 'itaberaba') {
            ctx.fillText('itaberaba.ifbaiano.edu.br', 153, 1030);
        }
        if (unidade.value === 'itapetinga') {
            ctx.fillText('itapetinga.ifbaiano.edu.br', 153, 1030);
        }
        if (unidade.value === 'santaines') {
            ctx.fillText('santaines.ifbaiano.edu.br', 153, 1030);
        }
        if (unidade.value === 'bonfim') {
            ctx.fillText('bonfim.ifbaiano.edu.br', 153, 1030);
        }
        if (unidade.value === 'serrinha') {
            ctx.fillText('serrinha.ifbaiano.edu.br', 153, 1030);
        }
        if (unidade.value === 'teixeira') {
            ctx.fillText('teixeira.ifbaiano.edu.br', 153, 1030);
        }
        if (unidade.value === 'urucuca') {
            ctx.fillText('urucuca.ifbaiano.edu.br', 153, 1030);
        }
        if (unidade.value === 'valenca') {
            ctx.fillText('valenca.ifbaiano.edu.br', 153, 1030);
        }
        if (unidade.value === 'xiquexique') {
            ctx.fillText('xique-xique.ifbaiano.edu.br', 153, 1030);
        }
    }
}

// bind the value of select with the address of the qr code
function qrUnidades() {
    if (link.value === '') {
        if (unidade.value === 'ifbaiano') {
            return 'https://ifbaiano.edu.br/portal/';
        }
        if (unidade.value === 'alagoinhas') {
            return 'https://ifbaiano.edu.br/unidades/alagoinhas';
        }
        if (unidade.value === 'lapa') {
            return 'https://www.ifbaiano.edu.br/unidades/lapa/';
        }
        if (unidade.value === 'catu') {
            return 'https://www.ifbaiano.edu.br/unidades/catu/';
        }
        if (unidade.value === 'gmb') {
            return 'https://www.ifbaiano.edu.br/unidades/gmb/';
        }
        if (unidade.value === 'guanambi') {
            return 'https://www.ifbaiano.edu.br/unidades/guanambi/';
        }
        if (unidade.value === 'itaberaba') {
            return 'https://www.ifbaiano.edu.br/unidades/itaberaba/';
        }
        if (unidade.value === 'itapetinga') {
            return 'https://www.ifbaiano.edu.br/unidades/itapetinga/';
        }
        if (unidade.value === 'santaines') {
            return 'https://www.ifbaiano.edu.br/unidades/santaines/';
        }
        if (unidade.value === 'bonfim') {
            return 'https://www.ifbaiano.edu.br/unidades/bonfim/';
        }
        if (unidade.value === 'serrinha') {
            return 'https://www.ifbaiano.edu.br/unidades/serrinha/';
        }
        if (unidade.value === 'teixeira') {
            return 'https://www.ifbaiano.edu.br/unidades/teixeira/';
        }
        if (unidade.value === 'urucuca') {
            return 'https://www.ifbaiano.edu.br/unidades/urucuca/';
        }
        if (unidade.value === 'valenca') {
            return 'https://www.ifbaiano.edu.br/unidades/valenca/';
        }
        if (unidade.value === 'xiquexique') {
            return 'https://www.ifbaiano.edu.br/unidades/xique-xique/';
        }
    }
}

// eliminate the https and slash in the shown link
function formatLink(param) {
    let linkTxt = param;
    if (linkTxt.indexOf('//') !== -1) {
        linkTxt = linkTxt.split('//')[1];
    }
    if (linkTxt[linkTxt.length - 1] === '/') {
        linkTxt = linkTxt.slice(0, -1);
    }
    return linkTxt;
}

// choose background image from select value
function backgroundSelect(value) {
    if (value === 'ifbaiano') {
        bgImage.src = './images/background-geral.jpg';
    }
    if (value === 'alagoinhas') {
        bgImage.src = 'images/background-alagoinhas.jpg';
    }
    if (value === 'lapa') {
        bgImage.src = 'images/background-bom-jesus-da-lapa.jpg';
    }
    if (value === 'catu') {
        bgImage.src = 'images/background-catu.jpg';
    }
    if (value === 'gmb') {
        bgImage.src = 'images/background-governador-mangabeira.jpg';
    }
    if (value === 'guanambi') {
        bgImage.src = 'images/background-guanambi.jpg';
    }
    if (value === 'itaberaba') {
        bgImage.src = 'images/background-itaberaba.jpg';
    }
    if (value === 'itapetinga') {
        bgImage.src = 'images/background-itapetinga.jpg';
    }
    if (value === 'santaines') {
        bgImage.src = 'images/background-santa-ines.jpg';
    }
    if (value === 'bonfim') {
        bgImage.src = 'images/background-senhor-do-bonfim.jpg';
    }
    if (value === 'serrinha') {
        bgImage.src = 'images/background-serrinha.jpg';
    }
    if (value === 'teixeira') {
        bgImage.src = 'images/background-teixeira-de-freitas.jpg';
    }
    if (value === 'urucuca') {
        bgImage.src = 'images/background-urucuca.jpg';
    }
    if (value === 'valenca') {
        bgImage.src = 'images/background-valenca.jpg';
    }
    if (value === 'xiquexique') {
        bgImage.src = 'images/background-xique-xique.jpg';
    }
    return bgImage;
}

// create instructions element
function instructions() {
    const pText = document.createElement('p');
    pText.innerHTML = `Aplica????o desenvolvida para auxiliar na emiss??o de cards para divulga????o em redes sociais. O campo <b><i>Selecione uma unidade</i></b> disp??e o fundo da imagem com a marca do campus escolhido, al??m de, caso o campo <b><i>Insira um link</i></b> n??o seja preenchido, insere o c??digo QR vinculado ao endere??o da unidade espec??fica. Os campos <b><i>T??tulo</i></b> e <b><i>Corpo do card</i></b> possuem restri????o de caracteres, sendo 90 e 370 no m??ximo, respectivamente, e comp??em as informa????es textuais principais da imagem. O endere??o inserido no campo <b><i>Insira um link</i></b> gera um c??digo para escaneamento pela c??mera do celular, al??m de dispor, em texto, o endere??o abaixo do c??digo gerado. Ap??s a visualiza????o do card, o mesmo poder?? ser baixado localmente.`;
    pText.classList.add('texto');
    return pText;
}

// takes the typed text, selects font size and arranges the line break in the proposed space
function consolideText(context, text, x, y, fitWidth, place) {
    let fontSize = function () {
        if (text.length < 40 && text.length > 20 && place === 'title') {
            return '100px';
        } else if (text.length >= 40 && place === 'title') {
            return '55px';
        } else if (place === 'title') {
            return '110px';
        }
        if (place === 'body') {
            return '30px';
        }
    };
    let lineHeight = Number(fontSize().replace('px', '')) + 10;
    let fontWeight = place === 'title' ? 700 : 300;
    fitWidth = fitWidth || 0;
    ctx.font = `${fontWeight} ${fontSize()} Roboto, Tahoma`;
    if (fitWidth <= 0) {
        context.fillText(text, x, y);
        return;
    }
    let wordsCT = text.split(' ') //text.split('\n'); I tried unsuccessfully to collect the enter typed in the textarea and reproduce it on the canvas screen
    let currentLine = 0;
    let idx = 1;
    while (wordsCT.length > 0 && idx <= wordsCT.length) {
        let str = wordsCT.slice(0, idx).join(' ');
        let w = context.measureText(str).width;
        if (w > fitWidth) {
            if (idx === 1) {
                idx = 2;
            }
            context.fillText(wordsCT.slice(0, idx - 1).join(' '), x, y + (lineHeight * currentLine));
            currentLine++;
            wordsCT = wordsCT.splice(idx - 1);
            idx = 1;
        }
        else {
            idx++;
        }
    }
    if (idx > 0) {
        context.fillText(wordsCT.join(' '), x, y + (lineHeight * currentLine));
    }
    yHeight = y + (lineHeight * currentLine);
}

// download created canvas image
function download() {
    downloadLnk.download = `card-${unidade.value}-${dateFormat.replace(/\//ig, '-')}-${time}`;
    this.href = image;
}

downloadLnk.addEventListener('click', download);
