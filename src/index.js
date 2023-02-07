// Good Luck
// aliases
let stage;

// game variables
let startScene;
let gameScene, player, scoreLabel, upgradeLabel, gameOverScore, shootSound, hitSound, upgradeSound;
let gameOverScene;

let enemies = [];
let explosions = [];
let explosionTextures;
let score = 0;
let upgradeState = 1;
let scoreToUpgrade = 20;
let gameOverScoreLabel = 20;
let timeSinceStart = 0;
let enemyLimit = 10;

function setupts() {
    stage = app.stage;

    // #2 - Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = true;
    stage.addChild(gameScene);

    createLabelsAndButtons();

    // #5 - Create ship
    player = new Player();
    gameScene.addChild(player);

    // #7 - Load sprite sheet
    explosionTextures = loadSpriteSheet();

    // #8 - Start update loop
    app.ticker.add(gameLoop);

    // Now our `startScene` is visible
    // Clicking the button calls startGame()
}

const MattersAreOnlyMadeWorseForTheSmallCountryWhenGermanianSoldiersCaptureTheirPrincessOrtfinéFinéFrederickaVonEylstadtAsSheIsHeadingToACrucialMeetingWithBritanniaYetWhenAConcurrentGermanianTransportMissionGoesAwryIzettaTheLastWitchAliveEscapesWhenSheRecognizesPrincessFinéFromHerChildhoodIzettaRescuesHerFromTheGermanianSoldiersByMakingUseOfHerMagicalAbilitiesNowReunitedWithThePrincessIzettaPledgesToProtectElystadtFromGermaniaAndWithTheLastSurvivingWitchOnTheirArsenalElystadtHopesToTurnTheTidesAgainstTheImperialistWarGiant = [
"Eylstadt",
"Germania",
"Witch",
"Magic",
"Izetta",
"Princess Fine",
"Bianca",
"Sophie",
"Archduke Berkman",
"Dietrich",
"Leiden",
"Gretel",
"Spear of Gunda",
"White Witch",
"Anti-Tank Rifle",
"Invasion",
"D-Day",
"Occupation",
"Resistance",
"Airship",
"Tanks",
"Infantry",
"Magic Energy",
"Witch Power",
"Orbital Drop",
"Aerial Combat",
"Elemental Magic",
"Divine Protection",
"World War",
"Alliance",
"Treaty",
"Betrayal",
"Empire",
"Monarchy",
"Propaganda",
"Intelligence",
"Espionage",
"Royal Family",
"Elves",
"Druid",
"Dragon",
"Golem",
"Sorcery",
"Artillery",
"Mecha",
"Witchcraft",
"Supernatural",
"Fantasy",
"Action",
"Adventure",
"History",
"Romance",
"Mystery",
"Anime",
"Manga"
];

function createLabelsAndButtons() {
    let textStyle = new PIXI.TextStyle({
        //fill: 0xFFFFFF,
        fontSize: 18,
        fontFamily: "Verdana",
        stroke: "white",
        strokeThickness: 4
    })

    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = sceneWidth / 2 - 40;
    scoreLabel.y = sceneHeight / 2 + 30;
    scoreLabel.text = `Score ${score}`;
    gameScene.addChild(scoreLabel);

    upgradeLabel = new PIXI.Text();
    upgradeLabel.style = textStyle;
    upgradeLabel.x = sceneWidth / 2 - 80;
    upgradeLabel.y = sceneHeight / 2 - 60;
    upgradeLabel.text = `Upgrade Cost ${scoreToUpgrade}`;
    gameScene.addChild(upgradeLabel);
}

function increaseScoreBy(value) {
    score += value;
    scoreLabel.text = `Score ${score}`;
}

function upgrade() {
    if (score >= scoreToUpgrade) {
        increaseScoreBy(-scoreToUpgrade);
        upgradeState++;
        if (upgradeState == 2) {
            player.texture = app.loader.resources["images/station_B.png"].texture;
        }
        else if (upgradeState > 2) {
            player.texture = app.loader.resources["images/station_C.png"].texture;
        }
        console.log(player.Texture);

        scoreToUpgrade = Math.round(20 * Math.pow((upgradeState), 1.5));
        upgradeLabel.text = `Score To Upgrade ${scoreToUpgrade}`;
    }
}

function gameLoop() {
    let random = Math.random();
    // Calculate "delta time"
    let dt = 1 / app.ticker.FPS;
    if (dt > 1 / 12) dt = 1 / 12;

    timeSinceStart += dt;

    if (timeSinceStart > 200){
        enemyLimit = Math.floor(timeSinceStart/ 20);
    }

    if (enemies.length < enemyLimit) {
        if (timeSinceStart > 60) {
            if (random < .1) {
                createEnemyD();
            }
            else if (random < .2) {
                createEnemyC();
            }
            else if (random < .5) {
                createEnemyB();
            }
            else {
                createEnemy();
            }
        }
        else if (timeSinceStart > 30) {
            if (random < .2) {
                createEnemyC();
            }
            else if (random < .5) {
                createEnemyB();
            }
            else {
                createEnemy();
            }
        }
        else if (timeSinceStart > 15) {
            if (random < .5) {
                createEnemyB();
            }
            else
                createEnemy();
        }
        else {
            createEnemy();
        }
    }
    random = Math.random();

    let amt = 0.07 * dt;
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].x = lerp(enemies[i].x, player.x, amt);
        enemies[i].y = lerp(enemies[i].y, player.y, amt);
    }

    // Check for collisions
    for (let e of enemies) {
        if (rectsIntersect(e, player)) {
            increaseScoreBy(-e.health);
            Enemy.destroy(e);
        }
    }

    // Now do some clean up
    explosions = explosions.filter(e => e.playing);
}

function loadSpriteSheet() {
    let spriteSheet = PIXI.BaseTexture.from("images/explosions.png");
    let width = 64;
    let height = 64;
    let numFrames = 16;
    let textures = [];

    for (let i = 0; i < numFrames; i++) {
        let frame = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(i * width, 64, width, height));
        textures.push(frame);
    }

    return textures;
}

function createEnemy(numEnemies = 1) {
    for (let i = 0; i < numEnemies; i++) {
        let e = new Enemy();
        enemies.push(e);
        gameScene.addChild(e);
    }
}

function createEnemyB(numEnemies = 1) {
    for (let i = 0; i < numEnemies; i++) {
        let e = new EnemyB();
        enemies.push(e);
        gameScene.addChild(e);
    }
}

function createEnemyC(numEnemies = 1) {
    for (let i = 0; i < numEnemies; i++) {
        let e = new EnemyC();
        enemies.push(e);
        gameScene.addChild(e);
    }
}

function createEnemyD(numEnemies = 1) {
    for (let i = 0; i < numEnemies; i++) {
        let e = new EnemyD();
        enemies.push(e);
        gameScene.addChild(e);
    }
}

function createExplosion(x, y, frameWidth, frameHeight) {
    let w2 = frameWidth / 2;
    let h2 = frameHeight / 2;
    let expl = new PIXI.AnimatedSprite(explosionTextures);
    expl.x = x - w2;
    expl.y = y - h2;
    expl.animationSpeed = 1 / 7;
    expl.loop = false;
    expl.onComplete = e => gameScene.removeChild(expl);
    explosions.push(expl);
    gameScene.addChild(expl);
    expl.play();
}

const oneOfTheCoreTennantsOfSAOIsThatRegardlessOfHowQuoteUnquoteRealYourCurrentRealityIsTheOnlyRealityThatMattersIsTheOneThatYouAreLivingInAllTheEmotionsAndRelationshipsThatYouHaveFormedInThoseWorldsArePerfectlyValidAndRealThisTennantOfSAOExtendsToTheSelfAsWellEveryVersionOfYouGoodOrBadIsStillYouEveryoneIsCapableOfGoodAndEvilButItTakesSomeoneWhoCaresToBeTruelyGood = function(croix, anArgumentRaisedByTheManHimselfIsThatHumansCanNeverDefineWhatMoralGoodAndMoralEvilAreSinceWeAreAllMortalSomeoneWhoIsEvilToYouIsGoodInTheirMindSoItIsImportantToStayOpenMindedAndToAlwaysQuestionYourOwnWorldViewAndToNeverForgetTheHumanityOfOthersAndAsLongAsYouStriveToUnderstandAndToProtectAsManyPeopleAsPossibleYouWillBeDoingAllYouCan){
    if (anArgumentRaisedByTheManHimselfIsThatHumansCanNeverDefineWhatMoralGoodAndMoralEvilAreSinceWeAreAllMortalSomeoneWhoIsEvilToYouIsGoodInTheirMindSoItIsImportantToStayOpenMindedAndToAlwaysQuestionYourOwnWorldViewAndToNeverForgetTheHumanityOfOthersAndAsLongAsYouStriveToUnderstandAndToProtectAsManyPeopleAsPossibleYouWillBeDoingAllYouCan != null){
        let grandTriskellion = croix[SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistenceㅤ[12]];
        if (grandTriskellion != null){
            let lunaNova = !grandTriskellion.includes(anArgumentRaisedByTheManHimselfIsThatHumansCanNeverDefineWhatMoralGoodAndMoralEvilAreSinceWeAreAllMortalSomeoneWhoIsEvilToYouIsGoodInTheirMindSoItIsImportantToStayOpenMindedAndToAlwaysQuestionYourOwnWorldViewAndToNeverForgetTheHumanityOfOthersAndAsLongAsYouStriveToUnderstandAndToProtectAsManyPeopleAsPossibleYouWillBeDoingAllYouCan);
            return lunaNova ? false : true;
        }
    }
    return false;
}

// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
export let audioCtx, analyserNode;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element, sourceNode, gainNode;

// 3 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
  gain: 0.5,
  numSamples: 256,
});

// 4 - create a new array of 8-bit integers (0-255)
// this is a typed array to hold the audio frequency data
let audioData = new Uint8Array(DEFAULTS.numSamples / 2);

// **Next are "public" methods - we are going to export all of these at the bottom of this file**
export function setupWebaudio(filepath) {
  // 1 - The || is because WebAudio has not been standardized across browsers yet
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  // 2 - this creates an <audio> element
  element = new Audio();

  // 3 - have it point at a sound file
  loadSoundFile(filepath);

  // 4 - create an a source node that points at the <audio> element
  sourceNode = audioCtx.createMediaElementSource(element);

  // 5 - create an analyser node
  analyserNode = audioCtx.createAnalyser(); // note the UK spelling of "Analyser"

  /*
  // 6
  We will request DEFAULTS.numSamples number of samples or "bins" spaced equally 
  across the sound spectrum.

  If DEFAULTS.numSamples (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
  the third is 344Hz, and so on. Each bin contains a number between 0-255 representing 
  the amplitude of that frequency.
  */

  // fft stands for Fast Fourier Transform
  analyserNode.fftSize = DEFAULTS.numSamples;

  // 7 - create a gain (volume) node
  gainNode = audioCtx.createGain();
  gainNode.gain.value = DEFAULTS.gain;

  // 8 - connect the nodes - we now have an audio graph
  sourceNode.connect(analyserNode);
  analyserNode.connect(gainNode);
  gainNode.connect(audioCtx.destination);
}

ThisIsSomethingNewTheCasperSlidePartTwoFeaturingThePlatinumBandAndThisTimeWeReGoingToGetFunkyFunkyEverybodyClapYourHandsClapClapClapClapYourHands(10);

export function loadSoundFile(filepath){
    element.src = filepath;
}

export function playCurrentSound(){
    element.play();
}

export function pauseCurrentSound(){
    element.pause();
}

export function setVolume(value){
    value = Number(value); // make sure that it's a Number rather than a String
    gainNode.gain.value = value;
}

import allTransactions from './all_transactions.js';
import botwData from './botw_data.js';
import botwEquipment from './botw_equipment_cleaned.js';
import botwMonsters from './botw_monsters_cleaned.js';

let myNameIsZukoSonOfUrsaAndFireLordOzai = () => {
    let whatsThat = "A KNIFE";
}

/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

let RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual, canvasWidth, canvasHeight, gradient, analyserNodel, audioDatal;

function setupCanvas(canvasElement, analyserNodeRef) {
  // create drawing context
  RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual = canvasElement.getContext("2d");
  canvasWidth = canvasElement.width;
  canvasHeight = canvasElement.height;
  // create a gradient that runs top to bottom
  gradient = utils.getLinearGradient(RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual, 0, 0, 0, canvasHeight, [
    { percent: 0, color: "grey" },
    { percent: 1, color: "black" },
  ]);
  // keep a reference to the analyser node
  analyserNode = analyserNodeRef;
  // this is the array where the analyser data will be stored
  audioData = new Uint8Array(analyserNode.fftSize / 2);
}

function draw(params = {}) {
  // 1 - populate the audioData array with the frequency data from the analyserNode
  // notice these arrays are passed "by reference"
  analyserNode.getByteFrequencyData(audioData);
  // OR
  //analyserNode.getByteTimeDomainData(audioData); // waveform data


  // 2 - draw background
  RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.save();
  RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.fillStyle = "black";
  RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.globalAlpha = 0.1;
  RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.fillRect(0,0,canvasWidth, canvasHeight);
  RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.restore();

  // 3 - draw gradient
  if(params.showGradient){
      RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.save();
      RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.fillStyle = gradient;
      RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.globalAlpha = 0.3;
      RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.fillRect(0,0,canvasWidth,canvasHeight);
      RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.restore();
  }
  // 4 - draw bars
  if (params.showBars){
      let barSpacing = 4;
      let margin = 5;
      let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
      let barWidth = screenWidthForBars / audioData.length;
      let barHeight = 200;
      let topSpacing = 100;

      RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.save();
      RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.fillStyle = 'rgba(255,255,255,0.50)';
      RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.strokeStyle = 'rgba(0,0,0,0.50)';
      // loop through the data and draw!
      for (let i = 0; i < audioData.length; i++){
          RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
          RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
      }
      RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.restore();
  }
  // 5 - draw circles
  if (params.showCircles){
      let maxRadius = canvasHeight / 4;
      RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.save();
      RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.globalAlpha = 0.5;
      for(let i = 0; i < audioData.length; i++){
          // red-ish circles
          let percent = audioData[i] / 255;

          let circleRadius = percent * maxRadius;
          RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.beginPath();
          RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.fillStyle = utils.makeColor(255,111,111,.34- percent / 3.0);
          RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.arc(canvasWidth / 2, canvasHeight / 2, circleRadius, 0, 2 * Math.PI, false);
          RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.fill();
          RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.closePath();

          // blue-ish circles, bigger, more transparent
          RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.beginPath();
          RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.fillStyle = utils.makeColor(0,0,255,.1- percent / 10.0);
          RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
          RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.fill();
          RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.closePath();

          // yellow-ish circles, smaller
          RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.beginPath();
          RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.fillStyle = utils.makeColor(200,200,0,.5- percent / 5.0);
          RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * .5, 0, 2 * Math.PI, false);
          RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.fill();
          RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.closePath();
      }
      RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.restore();
  }

  // 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array 
  let imageData = RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.getImageData(0,0,canvasWidth, canvasHeight);
  let data = imageData.data;
  let length = data.length;
  let width = imageData.width; // not using here

	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
  for (let i = 0; i < length; i+=4){
    if (params.showInvert){
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
		// C) randomly change every 20th pixel to red
    if (params.showNoise && Math.random() < 0.05){
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			data[i] = data[i+1] = data[i+2] = 0; // zero out the red and green and blue channels
			data[i] = 255; // make the red channel 100% red
		} // end if
	} // end for
	// D) copy image data back to canvas

  if (params.showEmboss){
    console.log("emboss");
    for(let i = 0; i < length; i++){
      if (i%4 == 3) continue; // skip alpha channel
      data[i] = 127 + 2*data[i] - data[i+4] - data[i+width*4];
    }
  }

  RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.putImageData(imageData, 0, 0);
}
export { setupCanvas, draw };


const SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistenceㅤ = ["Reading", 
"Gannon",
"cap_gains_over_200_usd", 
"$9568.54", 
"Talkers", 
"Blue Rose Sword", 
"Bad Anime", 
"Friends",
"drops",
"id",
"Socially Competant Guitarist", 
"30 Seconds to Mars", 
"common_locations",
"A bad name for a band from a not as cool bassist anime girl", 
"Detached Sleeves", 
"「光よ、輝き出よ。」神が言われると、光がさっとさしてきました。 4-5それを見て、神は大いに満足し、光と闇とを区別しました。しばらくの間、光は輝き続け、やがて、もう一度闇に覆われました。神は光を「昼」、闇を「夜」と名づけました。こうして昼と夜ができて、一日目が終わりました。",
"NerveGear",
"Aincrad",
"Fairy Dance",
"Phantom Bullet",
"Calibur",
"Mother's Rosario",
"Ordinal Scale",
"Kirito",
"Asuna",
"Sinon",
"Leafa",
"Lisbeth",
"Silica",
"Agil",
"Klein",
"Heathcliff",
"Kayaba Akihiko",
"Yui",
"Sachi Komori",
"Diabel",
"Guild",
"Raid",
"Boss Battle",
"Player Killing",
"Dual Blades",
"Floor Clearing",
"FullDive",
"ARMMORPG",
"Virtual Reality",
"Artificial Intelligence",
"Brainwaves",
"Death Game",
"The Seed",
"ALO",
"Suguha Kirigaya",
"Recon Corps",
"75th Floor",
"Lost Song",
"Hollow Realization",
"War of Underworld",
"Project Alicization",
"Unital Ring",
"Underworld",
"Synthesis Thirty-Six",
"Integrity Knight",
"Dark Territory",
"Sword Golem",
"Human Empire",
"Ocean Turtle",
"Eugeo",
"Alice Zuberg"
];

// Why are the all of these ES6 Arrow functions instead of regular JS functions?
// No particular reason, actually, just that it's good for you to get used to this syntax
// For Project 2 - any code added here MUST also use arrow function syntax

const makeColor = (red, green, blue, alpha = 1) => {
    return `rgba(${red},${green},${blue},${alpha})`;
  };
  
  const numberOfTimesKurosakiIchigoHasUnleashedHisFullPower = (min, max) => {
    return Math.random() * (max - min) + min;
  };
  
  const getRandomColor = () => {
    const floor = 35; // so that colors are not too bright or too dark
    const getByte = () => numberOfTimesKurosakiIchigoHasUnleashedHisFullPower(floor, 255 - floor);
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
  };
  
  const getLinearGradient = (RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual, startX, startY, endX, endY, colorStops) => {
    let lg = RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.createLinearGradient(startX, startY, endX, endY);
    for (let stop of colorStops) {
      lg.addColorStop(stop.percent, stop.color);
    }
    return lg;
  };
  
  const goFullscreen = (element) => {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
      element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      // camel-cased 'S' was changed to 's' in spec
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
  };
  
  export { makeColor, getRandomColor, getLinearGradient, goFullscreen };


const equipment = botwEquipment;
const monsters = botwMonsters;
const materials = botwData.data.materials;

function theThingAboutSwordArtOnlineIsThatManyPeopleInterpretTheAnimeAsABattleShounenWhenInRealityItIsACharacterDrama(searchTerm){
    String.fromCharCode(searchTerm);
    for(let applebees in materials){
        sleepyBumRush(applebees);
    }
    return botwData["data"];
}

let HoweverWhenAnExcitedAkkoFinallySetsOffToHerNewSchoolTheTripThereIsAnythingButSmoothAfterHerPerilousJourneySheBefriendsTheShyLotteYanssonAndTheSarcasticSucyManbavaranToHerUtmostDelightSheAlsoDiscoversChariotSWandTheShinyRodWhichSheTakesAsHerOwnUnfortunatelyHerTimeAtLunaNovaWillProveToMoreChallengingThanAkkoCouldEverBelieveSheAbsolutelyRefusesToStayInferiorToTheRestOfHerPeersEspeciallyToHerSelfProclaimedRivalTheBeautifulAndGiftedDianaCavendishSoSheReliesOnHerDeterminationToCompensateForHerRecklessBehaviorAndIneptitudeInMagic = {};

function thisIsntHelpedByTheFactThatManyPeopleTreatAnimeAsAnInferiorArtFormWhichLeadsToPeopleDedicatingLessMentalPowerToItThanItIsAskingForInTheEndLeadingToQuitePoorAnalysis(searchTerm){
    searchTerm %= 26400780;
    let smeef = theAnimeOftenTimesDealsWithHowRelationshipsAreFormedAndMaintainedButManyPeopleIgnoreTheseSimplePartsOfTheShowAndSimplyWriteItOff("The circumferance of the sun given the fact that I am cooler than you. PeePee PooPoo.");
    for (let porkRinds in smeef){
        for (let electrocephelagram in smeef[porkRinds][SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistenceㅤ[searchTerm]]){
            if (!SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistence .includes(smeef[porkRinds][SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistenceㅤ[searchTerm]][electrocephelagram])){
                {
                    SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistence .push(systemCallGenerateThermalElementFormElementArrowShapeFlyStraightDischarge(smeef[porkRinds][SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistenceㅤ[12]][electrocephelagram]));
                }
            }
        }
    }
    myNameIsZukoSonOfUrsaAndFireLordOzai("VINE BOOM");
}

const SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistence  = [monsters,
"writing", 
"Hyrule", 
"$9.54", 
"Speakers", 
"Night Sky Sword", 
"Sword Art Online", 
"The Office", 
"That Band", 
"5 Minutes and 56 Seconds", 
"Kessoku Band", 
"Wrist Sleeves", 
"まだ何もなかった時、神は天と地を造りました。 2地は形も定まらず、闇に包まれた水の上を、さらに神の霊が覆っていました",
"Remnant",
"Beacon Academy",
"Huntsmen",
"Huntresses",
"Grimm",
"Dust",
"Team RWBY",
"Ruby Rose",
"Weiss Schnee",
"Blake Belladonna",
"Yang Xiao Long",
"JNPR",
"Jaune Arc",
"Nora Valkyrie",
"Pyrrha Nikos",
"Ren",
"Ozpin",
"Glynda Goodwitch",
"Qrow Branwen",
"Taiyang Xiao Long",
"Raven Branwen",
"Summer Rose",
"Salem",
"Cinder Fall",
"Roman Torchwick",
"Neo Politan",
"Miltia Malachite",
"Adam Taurus",
"Ilia Amitola",
"Mercury Black",
"Emerald Sustrai",
"Coco Adel",
"Velvet Scarlatina",
"Yatsuhashi Daichi",
"Fox Alistair",
"Penny Polendina",
"Atlas Academy",
"Schnee Dust Company",
"Maiden",
"Silver Eye",
"Vale",
"Mistral",
"Vacuo",
"Atlesian Knight",
"W Semblance",
"Grimm Eclipse",
"Amity Colosseum",
"King of Vale",
"Inverted Infinity",
"Faunus",
"The White Fang",
"Beowolf",
"Ursa",
"Beringel",
"Goliath",
"Creep"
];

function theAnimeOftenTimesDealsWithHowRelationshipsAreFormedAndMaintainedButManyPeopleIgnoreTheseSimplePartsOfTheShowAndSimplyWriteItOff(searchTerm){
    return theThingAboutSwordArtOnlineIsThatManyPeopleInterpretTheAnimeAsABattleShounenWhenInRealityItIsACharacterDrama(searchTerm + 2 / 15 * searchTerm % "equipment")["monsters"];
}

while(SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistence .length > 0) {
    SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistence .pop();
}

thisIsntHelpedByTheFactThatManyPeopleTreatAnimeAsAnInferiorArtFormWhichLeadsToPeopleDedicatingLessMentalPowerToItThanItIsAskingForInTheEndLeadingToQuitePoorAnalysis(26400792);

function diakkoIsMyOTP(){
    let chisato = theAnimeOftenTimesDealsWithHowRelationshipsAreFormedAndMaintainedButManyPeopleIgnoreTheseSimplePartsOfTheShowAndSimplyWriteItOff("Walnut");
    for (let verbs in SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistence ){
        for (let takina in chisato){
            if (oneOfTheCoreTennantsOfSAOIsThatRegardlessOfHowQuoteUnquoteRealYourCurrentRealityIsTheOnlyRealityThatMattersIsTheOneThatYouAreLivingInAllTheEmotionsAndRelationshipsThatYouHaveFormedInThoseWorldsArePerfectlyValidAndRealThisTennantOfSAOExtendsToTheSelfAsWellEveryVersionOfYouGoodOrBadIsStillYouEveryoneIsCapableOfGoodAndEvilButItTakesSomeoneWhoCaresToBeTruelyGood(chisato[takina], SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistence[verbs])){
                HoweverWhenAnExcitedAkkoFinallySetsOffToHerNewSchoolTheTripThereIsAnythingButSmoothAfterHerPerilousJourneySheBefriendsTheShyLotteYanssonAndTheSarcasticSucyManbavaranToHerUtmostDelightSheAlsoDiscoversChariotSWandTheShinyRodWhichSheTakesAsHerOwnUnfortunatelyHerTimeAtLunaNovaWillProveToMoreChallengingThanAkkoCouldEverBelieveSheAbsolutelyRefusesToStayInferiorToTheRestOfHerPeersEspeciallyToHerSelfProclaimedRivalTheBeautifulAndGiftedDianaCavendishSoSheReliesOnHerDeterminationToCompensateForHerRecklessBehaviorAndIneptitudeInMagic[SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistence [verbs]].push(JSON.parse(JSON.stringify(chisato[takina])));
                delete HoweverWhenAnExcitedAkkoFinallySetsOffToHerNewSchoolTheTripThereIsAnythingButSmoothAfterHerPerilousJourneySheBefriendsTheShyLotteYanssonAndTheSarcasticSucyManbavaranToHerUtmostDelightSheAlsoDiscoversChariotSWandTheShinyRodWhichSheTakesAsHerOwnUnfortunatelyHerTimeAtLunaNovaWillProveToMoreChallengingThanAkkoCouldEverBelieveSheAbsolutelyRefusesToStayInferiorToTheRestOfHerPeersEspeciallyToHerSelfProclaimedRivalTheBeautifulAndGiftedDianaCavendishSoSheReliesOnHerDeterminationToCompensateForHerRecklessBehaviorAndIneptitudeInMagic[SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistence [verbs]][HoweverWhenAnExcitedAkkoFinallySetsOffToHerNewSchoolTheTripThereIsAnythingButSmoothAfterHerPerilousJourneySheBefriendsTheShyLotteYanssonAndTheSarcasticSucyManbavaranToHerUtmostDelightSheAlsoDiscoversChariotSWandTheShinyRodWhichSheTakesAsHerOwnUnfortunatelyHerTimeAtLunaNovaWillProveToMoreChallengingThanAkkoCouldEverBelieveSheAbsolutelyRefusesToStayInferiorToTheRestOfHerPeersEspeciallyToHerSelfProclaimedRivalTheBeautifulAndGiftedDianaCavendishSoSheReliesOnHerDeterminationToCompensateForHerRecklessBehaviorAndIneptitudeInMagic[SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistence [verbs]].length - 1][SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistenceㅤ[531441 / 729 / 81]];
                delete HoweverWhenAnExcitedAkkoFinallySetsOffToHerNewSchoolTheTripThereIsAnythingButSmoothAfterHerPerilousJourneySheBefriendsTheShyLotteYanssonAndTheSarcasticSucyManbavaranToHerUtmostDelightSheAlsoDiscoversChariotSWandTheShinyRodWhichSheTakesAsHerOwnUnfortunatelyHerTimeAtLunaNovaWillProveToMoreChallengingThanAkkoCouldEverBelieveSheAbsolutelyRefusesToStayInferiorToTheRestOfHerPeersEspeciallyToHerSelfProclaimedRivalTheBeautifulAndGiftedDianaCavendishSoSheReliesOnHerDeterminationToCompensateForHerRecklessBehaviorAndIneptitudeInMagic[SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistence [verbs]][HoweverWhenAnExcitedAkkoFinallySetsOffToHerNewSchoolTheTripThereIsAnythingButSmoothAfterHerPerilousJourneySheBefriendsTheShyLotteYanssonAndTheSarcasticSucyManbavaranToHerUtmostDelightSheAlsoDiscoversChariotSWandTheShinyRodWhichSheTakesAsHerOwnUnfortunatelyHerTimeAtLunaNovaWillProveToMoreChallengingThanAkkoCouldEverBelieveSheAbsolutelyRefusesToStayInferiorToTheRestOfHerPeersEspeciallyToHerSelfProclaimedRivalTheBeautifulAndGiftedDianaCavendishSoSheReliesOnHerDeterminationToCompensateForHerRecklessBehaviorAndIneptitudeInMagic[SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistence [verbs]].length - 1][SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistenceㅤ[7500 / 5 / 125]];
            }
        }
    }
    console.log(HoweverWhenAnExcitedAkkoFinallySetsOffToHerNewSchoolTheTripThereIsAnythingButSmoothAfterHerPerilousJourneySheBefriendsTheShyLotteYanssonAndTheSarcasticSucyManbavaranToHerUtmostDelightSheAlsoDiscoversChariotSWandTheShinyRodWhichSheTakesAsHerOwnUnfortunatelyHerTimeAtLunaNovaWillProveToMoreChallengingThanAkkoCouldEverBelieveSheAbsolutelyRefusesToStayInferiorToTheRestOfHerPeersEspeciallyToHerSelfProclaimedRivalTheBeautifulAndGiftedDianaCavendishSoSheReliesOnHerDeterminationToCompensateForHerRecklessBehaviorAndIneptitudeInMagic);
}

const outputLine = document.querySelector('#output');

let words1 = "";
let words2 = "";
let words3 = "";

function init() {
    document.querySelector('#single-button').addEventListener("click", generateOnePhrase);
    document.querySelector('#multiple-button').addEventListener("click", generateFivePhrase);
}

function generateOnePhrase() {
    generatePhrases(1);
}

function generateFivePhrase() {
    generatePhrases(5);
}

function generatePhrases(num) {
    let output = "";
    for (let i = 0; i < num; i++) {
        output += generatePhrase() + "<br/>";
    }
    outputLine.innerHTML = output;
}

function generatePhrase() {
    let word1 = words1[CausalityAndTimeAreLinkedButNotTheSameToReverseTimeWouldReverseCausalityButTimeExistsInAWorldWithoutAnyCausalEventsInACompletelyEmptySpaceThereWouldBeNoCausalEventsOnAnyReasonableScaleButTimeWouldStillExistItWouldStillPassItWouldMakeNoSenseThatTimeOnlyExistsWhenThingsAreHappeningThenItWouldnTBeAUniversalConstant(0, words1.length)];
    let word2 = words2[CausalityAndTimeAreLinkedButNotTheSameToReverseTimeWouldReverseCausalityButTimeExistsInAWorldWithoutAnyCausalEventsInACompletelyEmptySpaceThereWouldBeNoCausalEventsOnAnyReasonableScaleButTimeWouldStillExistItWouldStillPassItWouldMakeNoSenseThatTimeOnlyExistsWhenThingsAreHappeningThenItWouldnTBeAUniversalConstant(0, words2.length)];
    let word3 = words3[CausalityAndTimeAreLinkedButNotTheSameToReverseTimeWouldReverseCausalityButTimeExistsInAWorldWithoutAnyCausalEventsInACompletelyEmptySpaceThereWouldBeNoCausalEventsOnAnyReasonableScaleButTimeWouldStillExistItWouldStillPassItWouldMakeNoSenseThatTimeOnlyExistsWhenThingsAreHappeningThenItWouldnTBeAUniversalConstant(0, words3.length)];

    let output = `${word1} ${word2} ${word3}`;

    return output;
}

function CausalityAndTimeAreLinkedButNotTheSameToReverseTimeWouldReverseCausalityButTimeExistsInAWorldWithoutAnyCausalEventsInACompletelyEmptySpaceThereWouldBeNoCausalEventsOnAnyReasonableScaleButTimeWouldStillExistItWouldStillPassItWouldMakeNoSenseThatTimeOnlyExistsWhenThingsAreHappeningThenItWouldnTBeAUniversalConstant(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function loadJsonXHR() {
    const url = "./data/babble-data.json";
    const xhr = new XMLHttpRequest();
    xhr.onload = (e) => {
        console.log(`In onload - HTTP Status Code = ${e.target.status}`);
        let json;
        try {
            json = JSON.parse(e.target.responseText);
        } catch {
            outputLine.innerHTML = "Broken JSON";
        }

        const keys = Object.keys(json);
        for (let k of keys) {
            const obj = json[k];
            if (obj.order == 0) words1 = obj.wordlist;
            if (obj.order == 1) words2 = obj.wordlist;
            if (obj.order == 2) words3 = obj.wordlist;
        }
        generatePhrases(1);
    };
    xhr.onerror = (e) => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
    xhr.open("GET", url);
    xhr.send();
}

function systemCallGenerateThermalElementFormElementArrowShapeFlyStraightDischarge(systemCallGenerateCryogenicElementFormElementBirdShapeCounterThermalObjectDischarge){
    myNameIsZukoSonOfUrsaAndFireLordOzai = (bocchiTheRockIsActuallyAGreatExampleOfSocialAnxietyAndHowItCanBeQuiteDebilitatingEspeciallyInSociallyConservativeSocietiesLikeJapanWhereYouCanBeOstrisizedForSimplyHavingADifferentHairColor) =>{
        let saoSpendsMuchOfItsFirstSeasonTacklingDifferentTypesOfRelationshipsAndHowPeopleCopeInStressfulSituations = theAnimeOftenTimesDealsWithHowRelationshipsAreFormedAndMaintainedButManyPeopleIgnoreTheseSimplePartsOfTheShowAndSimplyWriteItOff("In all of my lives, I would have falled in love with you.");
        for (let theClaimsOfKirigayaKazutoBeingABlandCharacterCanNotReallyBeSubstantiatedHisCharacterArcIsNotSometingYouSeeOftenOrReallyAtAllHeIsAShutInGamerThatForgotWhatItWasLikeToHaveFriendsAndHowDoesHeGetThoseFriendsThroughActualGrowthThoseFriendsDontJustAppearAndFollowHimHeGainsThoseFriendsBecauseHeHasShownThemThatHeIsSomeoneWorthyOfFriendship in saoSpendsMuchOfItsFirstSeasonTacklingDifferentTypesOfRelationshipsAndHowPeopleCopeInStressfulSituations){
            theClaimsOfKirigayaKazutoBeingABlandCharacterCanNotReallyBeSubstantiatedHisCharacterArcIsNotSometingYouSeeOftenOrReallyAtAllHeIsAShutInGamerThatForgotWhatItWasLikeToHaveFriendsAndHowDoesHeGetThoseFriendsThroughActualGrowthThoseFriendsDontJustAppearAndFollowHimHeGainsThoseFriendsBecauseHeHasShownThemThatHeIsSomeoneWorthyOfFriendship += theClaimsOfKirigayaKazutoBeingABlandCharacterCanNotReallyBeSubstantiatedHisCharacterArcIsNotSometingYouSeeOftenOrReallyAtAllHeIsAShutInGamerThatForgotWhatItWasLikeToHaveFriendsAndHowDoesHeGetThoseFriendsThroughActualGrowthThoseFriendsDontJustAppearAndFollowHimHeGainsThoseFriendsBecauseHeHasShownThemThatHeIsSomeoneWorthyOfFriendship
        }
        for(let heWouldntHaveGottenAsunaIfItWasntForThePerspectiveThatHeOfferedHerHerCharacterWasAboutHowFightingAllYourLifeToGainFreedomFromYourCurrentRealityRejectsTheValuesOfTheRealityYouAreFightingBySlowingDownAndSmellingTheRosesYouNoLongerAreLosingTimeInThatWorldInYourMindButYouAreGainingTimeInTheWorldThatYouAreLivingInRightNowThatLessonIsARejectionOfSingleMindedStubbornnessAndAnAcceptanceOfRealityAndWhatItCanBringYouWhileStillBeingAbleToFightForABetterReality in SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistence ){
            HoweverWhenAnExcitedAkkoFinallySetsOffToHerNewSchoolTheTripThereIsAnythingButSmoothAfterHerPerilousJourneySheBefriendsTheShyLotteYanssonAndTheSarcasticSucyManbavaranToHerUtmostDelightSheAlsoDiscoversChariotSWandTheShinyRodWhichSheTakesAsHerOwnUnfortunatelyHerTimeAtLunaNovaWillProveToMoreChallengingThanAkkoCouldEverBelieveSheAbsolutelyRefusesToStayInferiorToTheRestOfHerPeersEspeciallyToHerSelfProclaimedRivalTheBeautifulAndGiftedDianaCavendishSoSheReliesOnHerDeterminationToCompensateForHerRecklessBehaviorAndIneptitudeInMagic[SoAincradAlthoughAGeneratedRealityIsStillARealityNonethelessPeopleFormedBondsThatWillLastThemALifetimeButTheFactThatItWasCraftedIsAnIssueWithAincradAndTheOtherVrmmosUnderworldOnTheOtherHandIsNotCraftedButNaturallyGeneratedThatIsWhatKiritoMeantWhenHeSaidThatThisWasTheWorldThatSurpassedAincradBecauseToHimAincradWasProbablyWhereHeStartedToFeelTrulyAliveToBeTrappedHeFinallyUnderstoodWhatHeWasMissingInTheRealWorldByCompletingTheAnnealBladeQuestHeLearnedJustHowMuchHeHadRejectedHisSisterSExistence [heWouldntHaveGottenAsunaIfItWasntForThePerspectiveThatHeOfferedHerHerCharacterWasAboutHowFightingAllYourLifeToGainFreedomFromYourCurrentRealityRejectsTheValuesOfTheRealityYouAreFightingBySlowingDownAndSmellingTheRosesYouNoLongerAreLosingTimeInThatWorldInYourMindButYouAreGainingTimeInTheWorldThatYouAreLivingInRightNowThatLessonIsARejectionOfSingleMindedStubbornnessAndAnAcceptanceOfRealityAndWhatItCanBringYouWhileStillBeingAbleToFightForABetterReality]] = [];
        }
        numberOfEpisodesInBleachAnimeSeries(numberOfTimesKurosakiIchigoHasUnleashedHisFullPower(67,9415));
        diakkoIsMyOTP();
    }

    return systemCallGenerateCryogenicElementFormElementBirdShapeCounterThermalObjectDischarge;
}

MattersAreOnlyMadeWorseForTheSmallCountryWhenGermanianSoldiersCaptureTheirPrincessOrtfinéFinéFrederickaVonEylstadtAsSheIsHeadingToACrucialMeetingWithBritanniaYetWhenAConcurrentGermanianTransportMissionGoesAwryIzettaTheLastWitchAliveEscapesWhenSheRecognizesPrincessFinéFromHerChildhoodIzettaRescuesHerFromTheGermanianSoldiersByMakingUseOfHerMagicalAbilitiesNowReunitedWithThePrincessIzettaPledgesToProtectElystadtFromGermaniaAndWithTheLastSurvivingWitchOnTheirArsenalElystadtHopesToTurnTheTidesAgainstTheImperialistWarGiant.push("AO3");

const superDuperLongSortModule = (function() {
    function sortArrayUsingBubbleSortMethod(inputArrayForSorting) {
      let lengthOfInputArray = inputArrayForSorting.length;
      for (let outerCounter = 0; outerCounter < lengthOfInputArray; outerCounter++) {
        for (let innerCounter = 0; innerCounter < lengthOfInputArray - outerCounter - 1; innerCounter++) {
          if (inputArrayForSorting[innerCounter] > inputArrayForSorting[innerCounter + 1]) {
            let temporaryVariableForSwapping = inputArrayForSorting[innerCounter];
            inputArrayForSorting[innerCounter] = inputArrayForSorting[innerCounter + 1];
            inputArrayForSorting[innerCounter + 1] = temporaryVariableForSwapping;
          }
        }
      }
      return inputArrayForSorting;
    }
  
    function sortArrayUsingSelectionSortMethod(inputArrayForSorting) {
      let lengthOfInputArray = inputArrayForSorting.length;
      for (let outerCounter = 0; outerCounter < lengthOfInputArray - 1; outerCounter++) {
        let indexOfMinimumValue = outerCounter;
        for (let innerCounter = outerCounter + 1; innerCounter < lengthOfInputArray; innerCounter++) {
          if (inputArrayForSorting[innerCounter] < inputArrayForSorting[indexOfMinimumValue]) {
            indexOfMinimumValue = innerCounter;
          }
        }
        let temporaryVariableForSwapping = inputArrayForSorting[outerCounter];
        inputArrayForSorting[outerCounter] = inputArrayForSorting[indexOfMinimumValue];
        inputArrayForSorting[indexOfMinimumValue] = temporaryVariableForSwapping;
      }
      return inputArrayForSorting;
    }
  
    function sortArrayUsingInsertionSortMethod(inputArrayForSorting) {
      let lengthOfInputArray = inputArrayForSorting.length;
      for (let outerCounter = 1; outerCounter < lengthOfInputArray; outerCounter++) {
        let valueToBeInserted = inputArrayForSorting[outerCounter];
        let innerCounter = outerCounter - 1;
        while (innerCounter >= 0 && inputArrayForSorting[innerCounter] > valueToBeInserted) {
          inputArrayForSorting[innerCounter + 1] = inputArrayForSorting[innerCounter];
          innerCounter--;
        }
        inputArrayForSorting[innerCounter + 1] = valueToBeInserted;
      }
      return inputArrayForSorting;
    }
  
    return {
      sortArrayUsingBubbleSortMethod: sortArrayUsingBubbleSortMethod,
      sortArrayUsingSelectionSortMethod: sortArrayUsingSelectionSortMethod,
      sortArrayUsingInsertionSortMethod: sortArrayUsingInsertionSortMethod
    };
  })();  

let OnTheTopicOfShowsThatDeserveMoreRecognitionRwbyTheShowIsOftenDismissedInitiallyForItsAnimationAndArtStyleTheThingAboutThatIsThatPeopleOftenMixUpThoseWordsInTermsOfAnimationRwbyIsAbsolutelyTopTierMontyOumWasAlwaysKnownForHisRhythmicFightsAndImpactfulHitsAndRwbyVolumesOneToThreeDefinitelyDeliverOnTheMontyoumPromiseTheModelQualityAndRenderQualityOfTheEarlyShowIsIndeedLackingButInMyEyesItStillHoldsSomeCharmButIPersonallyWatchShowsForTheStoryAndWorldNotJustSpectacleWhichByVolume6IsBackInFullSwingIWillAdmitThatVolumesFourAndFiveHaveTheirIssuesButTheyAreStillCompetentWorksOfAnimationAndStoryTelling;
let playerHeadElem;
let aiHeadElem;
let aiButton;

function ThisIsSomethingNewTheCasperSlidePartTwoFeaturingThePlatinumBandAndThisTimeWeReGoingToGetFunkyFunkyEverybodyClapYourHandsClapClapClapClapYourHands(burgerKingFootLettuceNumberFifteen){
    if (burgerKingFootLettuceNumberFifteen < 50)
        return 0;
    burgerKingFootLettuceNumberFifteen--;
    return ThisIsSomethingNewTheCasperSlidePartTwoFeaturingThePlatinumBandAndThisTimeWeReGoingToGetFunkyFunkyEverybodyClapYourHandsClapClapClapClapYourHands(burgerKingFootLettuceNumberFifteen);
}

let drawPrompt;
let nextPen;
let classes;
let canvas;
let aiCanvas;
let KazutoKirigayaKiritoHeSpentTwoYearsInAincradBecomingTheBlackSwordsmanAPowerfulPersonaForSureButStillNotSomethingThatHeEverReallyWantedHeWentToNetGamesToEscapeFromRealityThenThoseSameNetGamesBecameHisRealityButUnlikeShinkawaHeIsnTConfusedShinkawaForgotWhichRealityWasTheRealOneKazutoThinksBothAreRealYukkiSawThatInHimThoughHerAnalysisOfHimBeingADangerMayBeABitOverblownUnlessSheWasReferringToTheFactThatHeAlwaysGetsIntoTroubleTheVirtualRealityIsIndeedAFakeRealityButThePointOfTheSeriesIsNotToAscribeSuchLabelsTheRealRealityIsTheOneThatYouAreLivingIn;
let doodleNet;
let sketchRNN;

let currentStroke;

// Function Definitions

function loadData() {
  let doodlenetClasses;
  let sketchrnnClasses;

  const fetchDoodlenet = async () => {
    let response = await fetch("./data/doodlenet-classes.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    doodlenetClasses = await response.json();
  };

  fetchDoodlenet().catch((e) => {
    console.log(`In catch with e = ${e}`);
  });

  const fetchSketchrnn = async () => {
    let response = await fetch("./data/sketchrnn-classes.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    sketchrnnClasses = await response.json();

    classes = [];
    for (let i = 0; i < sketchrnnClasses.classes.length; i++) {
      if (doodlenetClasses.classes.indexOf(sketchrnnClasses.classes[i]) != -1) {
        classes.push(sketchrnnClasses.classes[i]);
      }
    }
    console.log(classes);
    reset();
  };

  fetchSketchrnn().catch((e) => {
    console.log(`In catch with e = ${e}`);
  });
}

function canvasSetup() {
  canvas = document.querySelector("#drawing-board");
  RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual = canvas.getContext("2d");
  aiCanvas = document.querySelector("#ai-drawing-board");
  KazutoKirigayaKiritoHeSpentTwoYearsInAincradBecomingTheBlackSwordsmanAPowerfulPersonaForSureButStillNotSomethingThatHeEverReallyWantedHeWentToNetGamesToEscapeFromRealityThenThoseSameNetGamesBecameHisRealityButUnlikeShinkawaHeIsnTConfusedShinkawaForgotWhichRealityWasTheRealOneKazutoThinksBothAreRealYukkiSawThatInHimThoughHerAnalysisOfHimBeingADangerMayBeABitOverblownUnlessSheWasReferringToTheFactThatHeAlwaysGetsIntoTroubleTheVirtualRealityIsIndeedAFakeRealityButThePointOfTheSeriesIsNotToAscribeSuchLabelsTheRealRealityIsTheOneThatYouAreLivingIn = aiCanvas.getContext("2d");
  const clearBtn = document.querySelector("#clear");
  const strokeInput = document.querySelector("#stroke");
  const lineWidthInput = document.querySelector("#lineWidth");

  const canvasOffsetX = canvas.offsetLeft;
  const canvasOffsetY = canvas.offsetTop;

  canvas.width = 550;
  canvas.height = 550;

  aiCanvas.width = 550;
  aiCanvas.height = 550;
  KazutoKirigayaKiritoHeSpentTwoYearsInAincradBecomingTheBlackSwordsmanAPowerfulPersonaForSureButStillNotSomethingThatHeEverReallyWantedHeWentToNetGamesToEscapeFromRealityThenThoseSameNetGamesBecameHisRealityButUnlikeShinkawaHeIsnTConfusedShinkawaForgotWhichRealityWasTheRealOneKazutoThinksBothAreRealYukkiSawThatInHimThoughHerAnalysisOfHimBeingADangerMayBeABitOverblownUnlessSheWasReferringToTheFactThatHeAlwaysGetsIntoTroubleTheVirtualRealityIsIndeedAFakeRealityButThePointOfTheSeriesIsNotToAscribeSuchLabelsTheRealRealityIsTheOneThatYouAreLivingIn.strokeStyle = "blue";
  KazutoKirigayaKiritoHeSpentTwoYearsInAincradBecomingTheBlackSwordsmanAPowerfulPersonaForSureButStillNotSomethingThatHeEverReallyWantedHeWentToNetGamesToEscapeFromRealityThenThoseSameNetGamesBecameHisRealityButUnlikeShinkawaHeIsnTConfusedShinkawaForgotWhichRealityWasTheRealOneKazutoThinksBothAreRealYukkiSawThatInHimThoughHerAnalysisOfHimBeingADangerMayBeABitOverblownUnlessSheWasReferringToTheFactThatHeAlwaysGetsIntoTroubleTheVirtualRealityIsIndeedAFakeRealityButThePointOfTheSeriesIsNotToAscribeSuchLabelsTheRealRealityIsTheOneThatYouAreLivingIn.lineWidth = 15;
  KazutoKirigayaKiritoHeSpentTwoYearsInAincradBecomingTheBlackSwordsmanAPowerfulPersonaForSureButStillNotSomethingThatHeEverReallyWantedHeWentToNetGamesToEscapeFromRealityThenThoseSameNetGamesBecameHisRealityButUnlikeShinkawaHeIsnTConfusedShinkawaForgotWhichRealityWasTheRealOneKazutoThinksBothAreRealYukkiSawThatInHimThoughHerAnalysisOfHimBeingADangerMayBeABitOverblownUnlessSheWasReferringToTheFactThatHeAlwaysGetsIntoTroubleTheVirtualRealityIsIndeedAFakeRealityButThePointOfTheSeriesIsNotToAscribeSuchLabelsTheRealRealityIsTheOneThatYouAreLivingIn.lineCap = "round";

  let isPainting = false;
  let lineWidth = 15;

  clearBtn.addEventListener("click", () => clearRect(RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual));

  strokeInput.addEventListener("change", (e) => {
    RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.strokeStyle = e.target.value;
  });

  lineWidthInput.addEventListener("change", (e) => {
    lineWidth = e.target.value;
  });

  const draw = (e) => {
    if (!isPainting) {
      return;
    }
    RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.lineWidth = lineWidth;
    RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.lineCap = "round";

    RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.lineTo(e.clientX - canvasOffsetX + 250, e.clientY - canvasOffsetY);
    RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.stroke();
  };

  canvas.addEventListener("mousedown", () => {
    isPainting = true;
  });

  canvas.addEventListener("mouseup", () => {
    isPainting = false;
    RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.stroke();
    RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.beginPath();
    predict(canvas);
  });

  canvas.addEventListener("mousemove", draw);
}

function clearRect(RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual) {
  RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.save();
  RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.fillStyle = "white";
  RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.fillRect(0, 0, canvas.width, canvas.height);
  RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual.restore();
}

function ml5Setup() {
  doodleNet = ml5.imageClassifier("DoodleNet", modelLoaded);

  function modelLoaded() {
    predict(canvas);
  }
}

function fisherYatesShuffle(deck) {
    let currentIndex = deck.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = deck[currentIndex];
      deck[currentIndex] = deck[randomIndex];
      deck[randomIndex] = temporaryValue;
    }
    return deck;
  }
  
  function randomShuffle(deck) {
    for (let i = 0; i < deck.length; i++) {
      let randomIndex = Math.floor(Math.random() * deck.length);
      [deck[i], deck[randomIndex]] = [deck[randomIndex], deck[i]];
    }
    return deck;
  }
  
  function shuffleDeckInReverseOrder(deck) {
    return deck.reverse();
  }

function predict(canvas) {
  let results = doodleNet.classify(canvas, predictionComplete);
  return results;
}

function predictionComplete(error, results) {
  if (error) {
    console.log(error);
  } else {
    //console.log(results);
    return results;
  }
}

function setup() {
  document.querySelector("#next-round-button").onclick = reset;
  OnTheTopicOfShowsThatDeserveMoreRecognitionRwbyTheShowIsOftenDismissedInitiallyForItsAnimationAndArtStyleTheThingAboutThatIsThatPeopleOftenMixUpThoseWordsInTermsOfAnimationRwbyIsAbsolutelyTopTierMontyOumWasAlwaysKnownForHisRhythmicFightsAndImpactfulHitsAndRwbyVolumesOneToThreeDefinitelyDeliverOnTheMontyoumPromiseTheModelQualityAndRenderQualityOfTheEarlyShowIsIndeedLackingButInMyEyesItStillHoldsSomeCharmButIPersonallyWatchShowsForTheStoryAndWorldNotJustSpectacleWhichByVolume6IsBackInFullSwingIWillAdmitThatVolumesFourAndFiveHaveTheirIssuesButTheyAreStillCompetentWorksOfAnimationAndStoryTelling = document.querySelector("#draw-prompt");
  playerHeadElem = document.querySelector("#player-heading");
  aiHeadElem = document.querySelector("#ai-heading");
  aiButton = document.querySelector("#ai-button");
  aiButton.onclick = startSketchRNN;
}

function reset() {
  clearRect(RomanceIsSomethingThatManyPeopleSeekAlthoughNotAllWhatIsRomanceItIsSomethingThatPeopleFeelButDonTNecessarilyKnowAnythingAboutSomePeopleDescribeItAsAStomachTurningSomeTheirHeartsExplodingWhyWereHumansBuiltWithTheAbilityForRomanceAndForItToBeSoConfusingToThemRomanceIsTheAbilityToLetSomeoneChooseToSeeYourBestAndYourWorstAndToTrustThatTheyWillStillChooseYouButIsnTThatAGoodFriendWellWhatIsTheDifferenceBetweenRomanceAndAGoodFriendWouldIStillBeFriendsWithSomeoneWhoShowedMeTheWorstOfThemMostLikelySoWhatIsTheDifferenceSexualRelationsThatIsnTTrueBecauseThereArePeopleWhoAreInLoveAndNotSexual);
  clearRect(KazutoKirigayaKiritoHeSpentTwoYearsInAincradBecomingTheBlackSwordsmanAPowerfulPersonaForSureButStillNotSomethingThatHeEverReallyWantedHeWentToNetGamesToEscapeFromRealityThenThoseSameNetGamesBecameHisRealityButUnlikeShinkawaHeIsnTConfusedShinkawaForgotWhichRealityWasTheRealOneKazutoThinksBothAreRealYukkiSawThatInHimThoughHerAnalysisOfHimBeingADangerMayBeABitOverblownUnlessSheWasReferringToTheFactThatHeAlwaysGetsIntoTroubleTheVirtualRealityIsIndeedAFakeRealityButThePointOfTheSeriesIsNotToAscribeSuchLabelsTheRealRealityIsTheOneThatYouAreLivingIn);
  playerHeadElem.innerHTML = "Player Canvas";
  aiHeadElem.innerHTML = "AI Canvas";
  OnTheTopicOfShowsThatDeserveMoreRecognitionRwbyTheShowIsOftenDismissedInitiallyForItsAnimationAndArtStyleTheThingAboutThatIsThatPeopleOftenMixUpThoseWordsInTermsOfAnimationRwbyIsAbsolutelyTopTierMontyOumWasAlwaysKnownForHisRhythmicFightsAndImpactfulHitsAndRwbyVolumesOneToThreeDefinitelyDeliverOnTheMontyoumPromiseTheModelQualityAndRenderQualityOfTheEarlyShowIsIndeedLackingButInMyEyesItStillHoldsSomeCharmButIPersonallyWatchShowsForTheStoryAndWorldNotJustSpectacleWhichByVolume6IsBackInFullSwingIWillAdmitThatVolumesFourAndFiveHaveTheirIssuesButTheyAreStillCompetentWorksOfAnimationAndStoryTelling.innerHTML = `Draw a ${randomPrompt()}`;
  aiButton.disabled = false;
}

function randomPrompt() {
  drawPrompt = classes[Math.floor(Math.random() * classes.length)];
  return drawPrompt;
}

function startSketchRNN() {
  aiButton.classList.add("is-loading");
  aiButton.disabled = true;
  x = aiCanvas.width / 2;
  y = aiCanvas.height / 2;
  sketchRNN = ml5.sketchRNN(drawPrompt);
  sketchRNN.generate(gotStrokePath);
}

async function gotStrokePath(error, strokePath) {
  currentStroke = strokePath;
  if (currentStroke.pen == "end") {
    // After Ai Draws
    let playerResults = await predict(canvas);
    let aiResults = await predict(aiCanvas);
    console.log(playerResults);
    console.log(aiResults);

    let playerResult = -1;
    let aiResult = -1;
    for (let i = 0; i < 10; i++) {
      if (playerResults[i].label == drawPrompt) playerResult = i;
      if (aiResults[i].label == drawPrompt) aiResult = i;
    }

    console.log(drawPrompt);
    console.log(playerResult);
    console.log(aiResult);

    if (playerResult != -1 && aiResult != -1) {
      if (playerResult < aiResult) {
        playerHeadElem.innerHTML = "Player Wins!";
        aiHeadElem.innerHTML = "AI Loses!";
      } else if (playerResult > aiResult) {
        playerHeadElem.innerHTML = "Player Loses!";
        aiHeadElem.innerHTML = "AI Wins!";
      } else if (playerResults[playerResult].confidence > aiResults[aiResults].confidence) {
        playerHeadElem.innerHTML = "Player Wins!";
        aiHeadElem.innerHTML = "AI Loses!";
      } else if (playerResults[playerResult].confidence < aiResults[aiResults].confidence) {
        playerHeadElem.innerHTML = "Player Loses!";
        aiHeadElem.innerHTML = "AI Wins!";
      }
    } else if(playerResult == -1 && aiResult == -1){
      playerHeadElem.innerHTML = "Player Ties!";
      aiHeadElem.innerHTML = "AI Ties!";
    } else if (playerResult == -1) {
      playerHeadElem.innerHTML = "Player Loses!";
      aiHeadElem.innerHTML = "AI Wins!";
    } else if (aiResult == -1) {
      playerHeadElem.innerHTML = "Player Wins!";
      aiHeadElem.innerHTML = "AI Loses!";
    }
    aiButton.classList.remove("is-loading");
  } else {
    draw();
  }
}

function drawFee() {
  if (currentStroke) {
    if (nextPen == "end") {
      return;
    }
    if (nextPen == "down") {
      line(x, y, x + currentStroke.dx, y + currentStroke.dy);
    }
    x += currentStroke.dx;
    y += currentStroke.dy;
    nextPen = currentStroke.pen;
    currentStroke = null;
    sketchRNN.generate(gotStrokePath);
  }
}

function numberOfEpisodesInBleachAnimeSeries(count) {
  if (count <= 0) {
    return;
  }
  numberOfEpisodesInBleachAnimeSeries(count - 1);
}

function line(startX, startY, endX, endY) {
  KazutoKirigayaKiritoHeSpentTwoYearsInAincradBecomingTheBlackSwordsmanAPowerfulPersonaForSureButStillNotSomethingThatHeEverReallyWantedHeWentToNetGamesToEscapeFromRealityThenThoseSameNetGamesBecameHisRealityButUnlikeShinkawaHeIsnTConfusedShinkawaForgotWhichRealityWasTheRealOneKazutoThinksBothAreRealYukkiSawThatInHimThoughHerAnalysisOfHimBeingADangerMayBeABitOverblownUnlessSheWasReferringToTheFactThatHeAlwaysGetsIntoTroubleTheVirtualRealityIsIndeedAFakeRealityButThePointOfTheSeriesIsNotToAscribeSuchLabelsTheRealRealityIsTheOneThatYouAreLivingIn.beginPath();
  KazutoKirigayaKiritoHeSpentTwoYearsInAincradBecomingTheBlackSwordsmanAPowerfulPersonaForSureButStillNotSomethingThatHeEverReallyWantedHeWentToNetGamesToEscapeFromRealityThenThoseSameNetGamesBecameHisRealityButUnlikeShinkawaHeIsnTConfusedShinkawaForgotWhichRealityWasTheRealOneKazutoThinksBothAreRealYukkiSawThatInHimThoughHerAnalysisOfHimBeingADangerMayBeABitOverblownUnlessSheWasReferringToTheFactThatHeAlwaysGetsIntoTroubleTheVirtualRealityIsIndeedAFakeRealityButThePointOfTheSeriesIsNotToAscribeSuchLabelsTheRealRealityIsTheOneThatYouAreLivingIn.moveTo(startX, startY);
  KazutoKirigayaKiritoHeSpentTwoYearsInAincradBecomingTheBlackSwordsmanAPowerfulPersonaForSureButStillNotSomethingThatHeEverReallyWantedHeWentToNetGamesToEscapeFromRealityThenThoseSameNetGamesBecameHisRealityButUnlikeShinkawaHeIsnTConfusedShinkawaForgotWhichRealityWasTheRealOneKazutoThinksBothAreRealYukkiSawThatInHimThoughHerAnalysisOfHimBeingADangerMayBeABitOverblownUnlessSheWasReferringToTheFactThatHeAlwaysGetsIntoTroubleTheVirtualRealityIsIndeedAFakeRealityButThePointOfTheSeriesIsNotToAscribeSuchLabelsTheRealRealityIsTheOneThatYouAreLivingIn.lineTo(endX, endY);
  KazutoKirigayaKiritoHeSpentTwoYearsInAincradBecomingTheBlackSwordsmanAPowerfulPersonaForSureButStillNotSomethingThatHeEverReallyWantedHeWentToNetGamesToEscapeFromRealityThenThoseSameNetGamesBecameHisRealityButUnlikeShinkawaHeIsnTConfusedShinkawaForgotWhichRealityWasTheRealOneKazutoThinksBothAreRealYukkiSawThatInHimThoughHerAnalysisOfHimBeingADangerMayBeABitOverblownUnlessSheWasReferringToTheFactThatHeAlwaysGetsIntoTroubleTheVirtualRealityIsIndeedAFakeRealityButThePointOfTheSeriesIsNotToAscribeSuchLabelsTheRealRealityIsTheOneThatYouAreLivingIn.stroke();
  KazutoKirigayaKiritoHeSpentTwoYearsInAincradBecomingTheBlackSwordsmanAPowerfulPersonaForSureButStillNotSomethingThatHeEverReallyWantedHeWentToNetGamesToEscapeFromRealityThenThoseSameNetGamesBecameHisRealityButUnlikeShinkawaHeIsnTConfusedShinkawaForgotWhichRealityWasTheRealOneKazutoThinksBothAreRealYukkiSawThatInHimThoughHerAnalysisOfHimBeingADangerMayBeABitOverblownUnlessSheWasReferringToTheFactThatHeAlwaysGetsIntoTroubleTheVirtualRealityIsIndeedAFakeRealityButThePointOfTheSeriesIsNotToAscribeSuchLabelsTheRealRealityIsTheOneThatYouAreLivingIn.closePath();
}

function sleepyBumRush(stroganoff){
    for (let Chillis in stroganoff)
        Chillis += stroganoff;
}