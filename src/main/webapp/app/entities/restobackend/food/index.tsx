import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Food from './food';
import FoodDetail from './food-detail';
import FoodUpdate from './food-update';
import FoodDeleteDialog from './food-delete-dialog';

const FoodRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Food />} />
    <Route path="new" element={<FoodUpdate />} />
    <Route path=":id">
      <Route index element={<FoodDetail />} />
      <Route path="edit" element={<FoodUpdate />} />
      <Route path="delete" element={<FoodDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default FoodRoutes;
