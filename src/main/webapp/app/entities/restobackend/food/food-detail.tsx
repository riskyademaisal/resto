import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './food.reducer';

export const FoodDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const foodEntity = useAppSelector(state => state.resto.food.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="foodDetailsHeading">Food</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{foodEntity.id}</dd>
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{foodEntity.name}</dd>
          <dt>
            <span id="description">Description</span>
          </dt>
          <dd>{foodEntity.description}</dd>
          <dt>
            <span id="price">Price</span>
          </dt>
          <dd>{foodEntity.price}</dd>
          <dt>
            <span id="foodSize">Food Size</span>
          </dt>
          <dd>{foodEntity.foodSize}</dd>
          <dt>
            <span id="image">Image</span>
          </dt>
          <dd>
            {foodEntity.image ? (
              <div>
                {foodEntity.imageContentType ? (
                  <a onClick={openFile(foodEntity.imageContentType, foodEntity.image)}>
                    <img src={`data:${foodEntity.imageContentType};base64,${foodEntity.image}`} style={{ maxHeight: '30px' }} />
                  </a>
                ) : null}
                <span>
                  {foodEntity.imageContentType}, {byteSize(foodEntity.image)}
                </span>
              </div>
            ) : null}
          </dd>
        </dl>
        <Button tag={Link} to="/food" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/food/${foodEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default FoodDetail;
