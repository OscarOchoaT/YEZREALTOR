/**
 * Tiny WebAudio synth for the Human + Technology build. Everything is
 * generated on the fly (no audio files). Browsers only allow sound after a
 * user gesture, so the context is created from the sound toggle's click.
 */

// A soft minor-pentatonic ladder so successive blips read as a melody.
const SCALE = [196, 233, 262, 311, 349, 392, 466, 523, 622, 698, 784];

export class Fx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;

  /** Must be called from a click/tap handler. */
  enable() {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return false;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(this.ctx.destination);
    }
    void this.ctx.resume();
    return true;
  }

  dispose() {
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }

  private tone(freq: number, dur: number, gain: number, type: OscillatorType = "sine", delay = 0) {
    const { ctx, master } = this;
    if (!ctx || !master) return;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  /** Melodic blip; `step` walks up the scale. */
  blip(step: number, gain = 0.05) {
    const f = SCALE[step % SCALE.length] * (step >= SCALE.length ? 2 : 1);
    this.tone(f, 0.3, gain, "sine");
    this.tone(f * 2, 0.16, gain * 0.35, "triangle");
  }

  /** Short data tick, used while text decodes. */
  tick() {
    this.tone(1400 + Math.random() * 500, 0.04, 0.012, "square");
  }

  /** Rising power-on sweep for the chip. */
  powerUp() {
    const { ctx, master } = this;
    if (!ctx || !master) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(70, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.9);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, t);
    filter.frequency.exponentialRampToValueAtTime(2400, t + 0.9);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
    osc.connect(filter).connect(g).connect(master);
    osc.start(t);
    osc.stop(t + 1.2);
  }

  /** Resolving chord for the moment human and technology connect. */
  resolve() {
    [262, 330, 392, 523].forEach((f, i) => this.tone(f, 1.8, 0.035, "sine", i * 0.06));
    this.tone(131, 2.2, 0.05, "sine");
  }
}
