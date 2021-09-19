import {setImageSize, MediaDisplayApp, setExtraData} from './MediaDisplayApp.js';
import {getMacroKey, isCorrectModifierPressed} from './settings.js';

const createArtButton = () => {
  let button = document.createElement('div');

  button.classList.add('control-icon');
  button.classList.add('artwork-open');
  button.innerHTML = `<i class="fas fa-image fa-fw"></i>`;
  button.title = 'Show Art';

  return $(button);
};

const createReceivedMediaDisplayApp = (receivedObject) => {
  const img = new Image();
  img.onload = () => {
    setImageSize({w: img.width, h: img.height});
    setExtraData(receivedObject.type, receivedObject.actorId);

    new MediaDisplayApp(receivedObject.imgPath, receivedObject.text, game.actors.get(receivedObject.actorId), receivedObject.type, game.user.isGM).render(true);
  };

  img.src = receivedObject.imgPath;
};

const createNewMediaDisplayApp = (imagePath, actor, type) => {
  const img = new Image();
  img.onload = () => {
    setImageSize({w: img.width, h: img.height});
    setExtraData(type, actor.data._id);

    new MediaDisplayApp(
      imagePath,
      actor.getFlag('ShowArt', `Author-${type}`),
      actor,
      type,
      game.user.isGM,
    ).render(true);
  };

  img.src = imagePath;
};

const receiveSharedImages = (receivedObject) => {
  createReceivedMediaDisplayApp(receivedObject);
};

const shareImage = async (imgPath, text, actorId, type) => {
  await game.socket.emit('module.ShowArt', {
    imgPath: imgPath,
    text: text,
    actorId: actorId,
    type: type
  });
};

const prepTokenKeybinding = (token, control) => {
  const doc = $(document);
  doc.off('keydown.showArt');
  if (!control) return;

  const actor = game.actors.get(token.data.actorId);
  const image = actor.data.img;
  const tokenImage = token.data.img;

  doc.on('keydown.showArt', (event) => keyEventHandler(event, image, tokenImage, actor));
};

const keyEventHandler = async (event, image, tokenImage, actor) => {
  if (isCorrectModifierPressed(event) && event.key.toLowerCase() === getMacroKey('showTokenToEveryOne') && game.user.isGM) {
    createNewMediaDisplayApp(tokenImage, actor, 'token');
    await shareImage(tokenImage, actor.getFlag('ShowArt', 'Author-token'), actor.data._id, 'token');
  } else if (isCorrectModifierPressed(event) && event.key.toLowerCase() === getMacroKey('showArtToEveryOne') && game.user.isGM) {
    createNewMediaDisplayApp(image, actor, 'main');
    await shareImage(image, actor.getFlag('ShowArt', 'Author-main'), actor.data._id, 'main');
  } else if (isCorrectModifierPressed(event) && event.key.toLowerCase() === getMacroKey('openToken')) {
    createNewMediaDisplayApp(tokenImage, actor, 'token');
  } else if (isCorrectModifierPressed(event) && event.key.toLowerCase() === getMacroKey('openArt')) {
    createNewMediaDisplayApp(image, actor, 'main');
  }
};

export {prepTokenKeybinding, receiveSharedImages, createArtButton, createNewMediaDisplayApp};
