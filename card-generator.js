let canvas, ctx, oldTxt, f, yHeight, background, image;
let txtTitle = document.getElementById('title');
let txtBody = document.getElementById('textBody');
const downloadLnk = document.querySelector('a#downloadLnk');
let contadorTitle = document.querySelector('div.contadorTitle');
let contadorBody = document.querySelector('div.contadorBody');
let countClick = 0;

txtTitle.addEventListener('keyup', () => {
    contadorTitle.innerText = txtTitle.value.length === 1 ? txtTitle.value.length + ' caractere' : txtTitle.value.length + ' caracteres';
});

txtBody.addEventListener('keyup', () => {
    contadorBody.innerText = txtBody.value.length === 1 ? txtBody.value.length + ' caractere' : txtBody.value.length + ' caracteres';
});

const date = new Date();
const dateFormat = date.getDate() + '/' + ((Number(date.getMonth()) + 1) < 10 ? '0' + (Number(date.getMonth()) + 1) : (Number(date.getMonth()) + 1)) + '/' + date.getFullYear();
const time = (date.getHours() < 10 ? '0' + date.getHours() + 'h' : date.getHours() + 'h') + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
const unidade = document.querySelector('select');
unidade.addEventListener('change', () => {
    background = backgroundSelect(unidade.value);
})
const bgImage = new Image;
//bgImage.crossOrigin = 'anonymous';
const link = document.getElementById('link');
const qrImage = new Image;
qrImage.crossOrigin = 'anonymous';

document.getElementById('generate').addEventListener('click', (ev) => {
    if (txtTitle.value.length > 3) {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        canvas.width = 1080;
        canvas.height = 1080;
        ctx.fillStyle = '#94d095';
        ctx.drawImage(background, 0, 0);
        fetch('https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=' + (link.value !== '' ? link.value : qrUnidades()))
            .then(() => {
                qrImage.src = 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=' + (link.value !== '' ? link.value : qrUnidades());
                qrImage.onload = function () {
                    ctx.drawImage(qrImage, 80, 800);
                };
                console.log('primeiro then');
            })
            .then(() => {
                drawText();
                ctx.fillStyle = '#72bc72';
                ctx.font = `normal 15px Roboto, Tahoma`;
                ctx.fillText('Endereço:', 80, 1030);
                ctx.fillStyle = '#56e83a';
                ctx.font = `bold 15px Roboto, Tahoma`;
                link.value !== '' ? ctx.fillText(formatLink(link.value), 153, 1030) : linkUnidades();
                canvas.classList.remove('displayNone');
                
                console.log('segundo then');
                setTimeout(() => {
                    if (countClick === 0) {
                        canvas.classList.toggle('visivel');
                        image = canvas.toDataURL('image/jpeg');
                        let fileSize = (image.length * (3 / 4)) - (image.substr(image.length - 2) === '==' ? 2 : 1);
                        let spanFileSize = document.querySelector('span.fileSize');
                        spanFileSize.innerText = '(' + (fileSize / 1000).toFixed(0) + ' kB' + ')';
                        downloadLnk.classList.toggle('visivel');
                    }
                    countClick++;
                }, 100);
            });


    } else {
        console.log('é preciso preencher o campo tal', txtTitle.value.length);
    }
});

const drawText = function () {
    ctx.fillStyle = '#72bc72';
    //textAlign center, left, right, end, start
    //textBaseline top, hanging, middle, bottom,ideographic, alphabetic
    ctx.textBaseline = 'alphabetic';
    //direction ltr, rtl, inherit
    ctx.fillStyle = '#94d095';
    ctx.font = `bold 20px Roboto, Tahoma`;
    ctx.fillText(`Código QR`, 300, 910);
    ctx.fillStyle = '#72bc72';
    ctx.font = `normal 18px Roboto, Tahoma`;
    ctx.fillText(`Escaneie o código`, 300, 940);
    ctx.fillText(`de barras ao lado usando`, 300, 965);
    ctx.fillText(`a câmera do celular.`, 300, 990);

    ctx.direction = 'ltr';

    ctx.textAlign = 'right';
    ctx.font = `normal 18px Roboto, Tahoma`;
    ctx.fillText(`IMAGEM CRIADA ÀS ${time} DO DIA ${dateFormat}`, 1000, 80);

    ctx.textAlign = 'start';

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop('0', '#eaffe7');
    //gradient.addColorStop('0.5', '#fff');
    gradient.addColorStop('1.0', '#40ff66');
    ctx.fillStyle = gradient;

    consolideText(ctx, txtTitle.value, 80, !txtBody.value ? 400 : 250, 850, 'title');
    ctx.fillStyle = '#c4ebc5';
    consolideText(ctx, txtBody.value, 80, yHeight + 80, txtTitle.value.length > 30 && txtTitle.value.length < 40 ? 920 : 800, 'body');
}

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

    let wordsCT = text.split(' ') //text.split('\n');
    let enter = '\n';

    let currentLine = 0;
    let idx = 1;
    while (wordsCT.length > 0 && idx <= wordsCT.length) {
        let str = wordsCT.slice(0, idx).join(' ');
        let w = context.measureText(str).width;
        if (w > fitWidth) {
            if (idx === 1) {
                idx = 2;
            }

            /* //console.log('txtbody', txtBody.value.split('\n'));

            if (text.indexOf('\n') !== -1) {
                //console.log('identificou a quebra de linha', wordsCT);
                for (let i in wordsCT) {
                    //console.log(i);
                    console.log(wordsCT[i].indexOf('\n'));
                    context.fillText(wordsCT[i], x, y + (lineHeight * currentLine));
                }
            } */
            //console.log(wordsCT.slice(0, idx - 1).join(' '));
            let lineWords = wordsCT.slice(0, idx - 1).join(' ');
            //console.log(lineWords.indexOf('\n') !== -1 ? lineWords.split(lineWords.indexOf('\n')));
            console.log(lineWords.split(enter, 3)[1]);

            context.fillText(wordsCT.slice(0, idx - 1).join(' '), x, y + (lineHeight * currentLine));
            context.fillText(' ', x, y + (lineHeight * currentLine));
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

function download() {
    downloadLnk.download = `card-${unidade.value}-${dateFormat.replace(/\//ig, '-')}-${time}`;
    this.href = image;
}

downloadLnk.addEventListener('click', download);