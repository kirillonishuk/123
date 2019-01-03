const cases = {
    'component-outgoing-message': function (wmsg) {
        return {
            text: wmsg.text,
            type: 'incoming',
            form: 'message'
        }
    },
    'component-keyboard': function (wmsg) {
        let variants = '';
        wmsg.buttons.forEach((elem, id, array) => {
            if (id !== array.length - 1)
                variants += `${elem.text}/`;
            else variants += elem.text;
        });
        return {
            text: `Варианты ответа: ${variants}`,
            type: 'incoming',
            form: 'message'
        };
    },
    'component-outgoing-picture': function (wmsg) {
        return {
            image: wmsg.image,
            filename: wmsg.filename,
            type: 'incoming',
            form: 'image'
        }
    },
    'component-outgoing-document': function (wmsg) {
        return {
            file: wmsg.file,
            name: wmsg.name,
            type: 'incoming',
            form: 'file'
        }
    },
    'default': function (wmsg) {
        return {
            text: wmsg.text || 'Error message!',
            type: 'incoming',
            form: 'message'
        }
    }
}


export default function (wmsg) {
    let result = {};
    if (wmsg.type in cases) {
        result = cases[wmsg.type](wmsg);
    } else {
        result = cases['default'](wmsg);
    };
    return result;
};