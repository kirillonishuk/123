const cases = {
    'component-outgoing-message': function (wmsg) {
        return {
            text: wmsg.text,
            type: 'incoming',
            form: 'message',
            time: new Date()
        };
    },
    'component-ingoing-message': function (wmsg) {
        return {
            text: wmsg.text,
            type: 'outgoing',
            form: 'message',
            time: new Date()
        };
    },
    'component-keyboard': function (wmsg) {
        return {
            buttons: wmsg.buttons,
            type: 'incoming',
            form: 'keyboard',
            time: new Date()
        };
    },
    'component-outgoing-picture': function (wmsg) {
        return {
            image: wmsg.image,
            filename: wmsg.filename,
            type: 'incoming',
            form: 'image',
            time: new Date()
        };
    },
    'component-ingoing-picture': function (wmsg) {
        return {
            image: wmsg.image,
            filename: wmsg.filename,
            type: 'outgoing',
            form: 'image',
            time: new Date()
        };
    },
    'component-outgoing-audio': function (wmsg) {
        return {
            file: wmsg.file,
            mime: wmsg.mime,
            type: 'incoming',
            form: 'audio',
            time: new Date()
        };
    },
    'component-outgoing-document': function (wmsg) {
        return {
            file: wmsg.file,
            name: wmsg.name,
            type: 'incoming',
            form: 'file',
            time: new Date()
        };
    },
    'component-ingoing-document': function (wmsg) {
        return {
            file: wmsg.file,
            name: wmsg.name,
            type: 'outgoing',
            form: 'file',
            time: new Date()
        };
    },
    'default': function (wmsg) {
        return {
            text: wmsg.text || 'Error message!',
            type: 'incoming',
            form: 'message',
            time: new Date()
        };
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