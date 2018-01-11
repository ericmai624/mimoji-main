const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();

// playerManager.addEventListener(
//   cast.framework.events.EventType.PLAYER_LOAD_COMPLETE, () => {
//     const textTracksManager = playerManager.getTextTracksManager();

//     // Get all text tracks
//     const tracks = textTracksManager.getTracks();

//     // Choose the first text track to be active by its ID
//     textTracksManager.setActiveByIds([tracks[0].trackId]);
//   });
  
const playbackConfig = new cast.framework.PlaybackConfig();
// playbackConfig.autoResumeDuration = 5;
playbackConfig.initialBandwidth = 10 * 1024 * 1024;

context.start({ playbackConfig });