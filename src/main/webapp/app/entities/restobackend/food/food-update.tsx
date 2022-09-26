import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm, ValidatedBlobField } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IFood } from 'app/shared/model/restobackend/food.model';
import { Size } from 'app/shared/model/enumerations/size.model';
import { getEntity, updateEntity, createEntity, reset } from './food.reducer';

export const FoodUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const foodEntity = useAppSelector(state => state.resto.food.entity);
  const loading = useAppSelector(state => state.resto.food.loading);
  const updating = useAppSelector(state => state.resto.food.updating);
  const updateSuccess = useAppSelector(state => state.resto.food.updateSuccess);
  const sizeValues = Object.keys(Size);

  const handleClose = () => {
    navigate('/food' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...foodEntity,
      ...values,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          foodSize: 'SMALL',
          ...foodEntity,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="restoApp.restobackendFood.home.createOrEditLabel" data-cy="FoodCreateUpdateHeading">
            Create or edit a Food
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="food-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField
                label="Name"
                id="food-name"
                name="name"
                data-cy="name"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField label="Description" id="food-description" name="description" data-cy="description" type="text" />
              <ValidatedField
                label="Price"
                id="food-price"
                name="price"
                data-cy="price"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                  min: { value: 0, message: 'This field should be at least 0.' },
                  validate: v => isNumber(v) || 'This field should be a number.',
                }}
              />
              <ValidatedField label="Food Size" id="food-foodSize" name="foodSize" data-cy="foodSize" type="select">
                {sizeValues.map(size => (
                  <option value={size} key={size}>
                    {size}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedBlobField label="Image" id="food-image" name="image" data-cy="image" isImage accept="image/*" />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/food" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default FoodUpdate;
