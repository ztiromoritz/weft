export default class IdUtil {
    static nonCollidingId(targetId, story) {
        let i = 1, collision, originalTarget = targetId;
        while (typeof(collision = story.entries.find(entry => entry.id === targetId)) !== 'undefined') {
            targetId = `${originalTarget}_${i++}`;
        }
        return targetId;
    }
}