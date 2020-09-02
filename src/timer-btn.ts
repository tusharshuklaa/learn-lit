/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import {LitElement, html, customElement, property, css, internalProperty} from 'lit-element';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('timer-btn')
export class TimerBtn extends LitElement {
  private timerInterval: NodeJS.Timeout | null;

  static styles = css`
    :host {
      font-size: 12px;
      display: inline-block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }

    section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    h2 {
      font-size: 5rem;
      font-family: monospace, sans-serif;
      margin: 2rem auto;
      line-height: 1;
    }

    button {
      background: #fff;
      border: 1px solid;
      border-radius: 3px;
      padding: 0.5em 1em;
      font-size: 1.5rem;
      margin: 1em;
    }
  `;

  constructor() {
    super();
    this.timerInterval = null;
  }

  /**
   * The name to say "Hello" to.
   */
  @property({ type: Boolean})
  hasStarted = false;

  /**
   * The number of times the button has been clicked.
   */
  @property()
  timer = '00:00:00:00';

  @internalProperty()
  ms = 0;

  @internalProperty()
  sec = 0;

  @internalProperty()
  min = 0;

  @internalProperty()
  hr = 0;

  render() {
    return html`
      <slot></slot>

      <section>
        <h2>${this.timer}</h2>

        <div class='btn-container'>
          <button @click=${this._onClick} part="button">
            ${this.hasStarted ? 'Stop' : 'Start'}
          </button>

          <button @click=${this._reset}>Reset</button>
        </div>
      </section>
    `;
  }

  private _onClick(_ev: Event, stop = false): void {
    if(stop === true) {
      clearInterval(this.timerInterval!);
      this.hasStarted = false;
    } else {
      if(this.hasStarted) {
        clearInterval(this.timerInterval!);
      } else {
        this.timerInterval = setInterval(this._timerFn.bind(this), 10);
      }

      this.hasStarted = !this.hasStarted;
    }
  }

  private prefixZero(val: number): string {
    return val < 10 ? `0${val}` : `${val}`;
  }

  private _timerFn(): void {
    this.ms++;

    if(this.ms >= 100){
      this.sec++
      this.ms = 0
    }

    if(this.sec === 60){
        this.min++
        this.sec = 0
    }

    if(this.min === 60) {
        this.hr++;
        this.ms = 0;
        this.sec = 0;
        this.min = 0;
    }

    this.timer = `${this.prefixZero(this.hr)}:${this.prefixZero(this.min)}:${this.prefixZero(this.sec)}:${this.prefixZero(this.ms)}`;
  }

  private _reset(ev: Event): void {
    this._onClick(ev, true);
    this.hr = 0;
    this.min = 0;
    this.sec = 0;
    this.ms = 0;
    this.timer = '00:00:00:00';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'timer-btn': TimerBtn;
  }
}
