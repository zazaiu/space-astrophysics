import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import type { Planet } from '../services/api/generated/services/PlanetsService';
import { addPlanetToDraft, removePlanetFromDraft, clearDraft } from '../store/worldsSlice';

export const WorldEdit: React.FC = () => {
  const dispatch = useAppDispatch();
  const draftWorld = useAppSelector(state => state.worlds.draftWorld);

  const handleAddPlanet = (p: Planet) => {
    dispatch(addPlanetToDraft(p));
  };

  const handleRemovePlanet = (id: number) => {
    dispatch(removePlanetFromDraft(id));
  };

  return (
    <div>
      {/* UI для редактирования мира */}
    </div>
  );
};
 