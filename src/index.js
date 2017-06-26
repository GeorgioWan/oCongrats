import './styles/index.scss'

import React from 'react'
import {render} from 'react-dom'

import * as firebase from 'firebase'
import { firebaseConfig } from '../firebase-config'

import App from './container/App'

// Firebase initialize
firebase.initializeApp( firebaseConfig );

render(<App />, document.querySelector('#app'))
