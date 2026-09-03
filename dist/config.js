import fs from 'fs-extra';
import os from 'os';
import path from 'path';
const SETTINGS_PATH = path.join(os.homedir(), '.claude', 'settings.json');
const RECOMMENDED_SETTINGS = {
    "agents": {
        "default_model": "sonnet",
        "orchestrator_model": "opus"
    },
    "skills": {
        "auto_apply_fixes": true
    }
};
export async function mergeRecommendedSettings() {
    let currentSettings = {};
    if (await fs.pathExists(SETTINGS_PATH)) {
        try {
            currentSettings = await fs.readJson(SETTINGS_PATH);
        }
        catch (e) {
            console.error('Error reading settings.json, starting with empty config');
        }
    }
    const updatedSettings = {
        ...currentSettings,
        ...RECOMMENDED_SETTINGS,
        // Deep merge for nested objects
        agents: { ...currentSettings.agents, ...RECOMMENDED_SETTINGS.agents },
        skills: { ...currentSettings.skills, ...RECOMMENDED_SETTINGS.skills },
    };
    const hasChanged = JSON.stringify(currentSettings) !== JSON.stringify(updatedSettings);
    if (hasChanged) {
        await fs.writeJson(SETTINGS_PATH, updatedSettings, { spaces: 2 });
    }
    return { updated: hasChanged, settings: updatedSettings };
}
