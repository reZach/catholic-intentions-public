import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Prayers } from './components/Prayers';
import { Submit } from './components/Submit';
import { Review } from './components/Review';

export const routes = <Layout>
    <Route path='/prayer\-requests' component={Prayers} />
    <Route path='/submit\-prayer\-request' component={Submit} />
    <Route path='/review' component={Review} />
</Layout>;
