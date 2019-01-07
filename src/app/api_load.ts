import {ApiService} from './api.service';

export function loadUserProvider(provider: ApiService) {
  return () => provider.loadUser();
}

export function loadFurnitureTypesProvider(provider: ApiService) {
  return () => provider.loadFurnitureTypes();
}

export function loadMassageRigidityTypesProvider(provider: ApiService) {
  return () => provider.loadMassageRigidityTypes();
}

