import _ from 'lodash';
import { observable, observe } from 'mobx';
import StitchService from './StitchService';
import GroupStore from './GroupStore';
import Uploader from './Uploader';
import UiState from './UiState';

export default class Store {
  stitch;
  viewer;

  @observable isReady = false;

  constructor() {
    this.groupStore = new GroupStore();
    this.uploader = new Uploader();
    this.uiState = new UiState();

    observe(this.uploader, 'uploading', change => {
      if (change.newValue === false) {
        this.groupStore.load();
      }
    });
  }

  async initialize({ StitchClient }) {
    this.stitch = await StitchService.create({
      StitchClient,
    });
    this.groupStore.stitch = this.stitch;
    this.uploader.stitch = this.stitch;

    await this.groupStore.load();

    this.isReady = true;
  }
}
