import { jsx as _jsx } from "react/jsx-runtime";
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addPlanetToDraft, removePlanetFromDraft } from '../store/worldsSlice';
export const WorldEdit = () => {
    const dispatch = useAppDispatch();
    const draftWorld = useAppSelector(state => state.worlds.draftWorld);
    const handleAddPlanet = (p) => {
        dispatch(addPlanetToDraft(p));
    };
    const handleRemovePlanet = (id) => {
        dispatch(removePlanetFromDraft(id));
    };
    return (_jsx("div", {}));
};
