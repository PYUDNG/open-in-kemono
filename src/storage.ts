import { UserscriptStorage } from "./utils/main.js";
import { GM_addValueChangeListener, GM_deleteValue, GM_getValue, GM_listValues, GM_setValue } from '$'

const storage = new UserscriptStorage(
    { GM_addValueChangeListener, GM_deleteValue, GM_getValue, GM_listValues, GM_setValue },
    {
        newtab: true,
        domain: 'kemono.cr',
    },
);

export default storage;