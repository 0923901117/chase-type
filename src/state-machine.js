/**
 * Simple finite state machine for the game.
 * Each state has: enter(ctx), update(ctx, dt), exit(ctx), render(ctx)
 */

export class StateMachine {
  constructor(states, initial) {
    this.states = states;
    this.current = null;
    this.previous = null;
    
    if (initial && states[initial]) {
      this.transition(initial, null);
    }
  }

  transition(to, ctx) {
    if (this.current && this.states[this.current]?.exit) {
      this.states[this.current].exit(ctx);
    }
    this.previous = this.current;
    this.current = to;
    if (this.states[to]?.enter) {
      this.states[to].enter(ctx);
    }
  }

  update(ctx, dt) {
    const state = this.states[this.current];
    if (state?.update) {
      const next = state.update(ctx, dt);
      if (next && next !== this.current) {
        this.transition(next, ctx);
      }
    }
  }

  render(ctx) {
    const state = this.states[this.current];
    if (state?.render) {
      state.render(ctx);
    }
  }
}

// ---- Placeholder state implementations ----

export function createChaseState() {
  return {
    enter(ctx) {
      console.log("[State] Chase enter — NPC:", ctx.npc?.name);
    },
    update(ctx, dt) {
      // TODO: Issue #3 — full chase logic
      return null; // stay in chase
    },
    render(ctx) {
      const { canvas, c } = ctx;
      c.fillStyle = "#3a2818";
      c.fillRect(0, 0, canvas.width, canvas.height);
      
      // Placeholder characters
      c.fillStyle = "#27ae60";
      c.fillRect(100, canvas.height / 2 - 20, 24, 40); // player
      c.fillStyle = "#e74c3c";
      c.fillRect(ctx.npcPos || 600, canvas.height / 2 - 20, 24, 40); // NPC
      
      c.fillStyle = "#e0d7c6";
      c.font = "16px monospace";
      c.fillText("[追逐阶段]", canvas.width / 2 - 40, 30);
    }
  };
}

export function createDuelTransitionState() {
  return {
    enter(ctx) {
      console.log("[State] DuelTransition enter");
    },
    update(ctx, dt) {
      // Brief pause, then transition to duel
      ctx.transitionTimer = (ctx.transitionTimer || 0) + dt;
      if (ctx.transitionTimer > 1.0) {
        ctx.transitionTimer = 0;
        return "duel";
      }
      return null;
    },
    render(ctx) {
      const { canvas, c } = ctx;
      c.fillStyle = "#1a0e05";
      c.fillRect(0, 0, canvas.width, canvas.height);
      c.fillStyle = "#f0e68c";
      c.font = "24px monospace";
      c.fillText("追上了！对决开始！", canvas.width / 2 - 120, canvas.height / 2);
    }
  };
}

export function createDuelState() {
  return {
    enter(ctx) {
      console.log("[State] Duel enter");
    },
    update(ctx, dt) {
      // TODO: Issue #4 — full duel logic
      return null;
    },
    render(ctx) {
      const { canvas, c } = ctx;
      c.fillStyle = "#1a0e05";
      c.fillRect(0, 0, canvas.width, canvas.height);
      
      // Progress bars
      c.fillStyle = "#3a2818";
      c.fillRect(80, canvas.height / 2 - 60, canvas.width - 160, 20);
      c.fillRect(80, canvas.height / 2 + 10, canvas.width - 160, 20);
      
      c.fillStyle = "#27ae60";
      c.fillRect(80, canvas.height / 2 - 60, (canvas.width - 160) * 0.3, 20);
      c.fillStyle = "#e74c3c";
      c.fillRect(80, canvas.height / 2 + 10, (canvas.width - 160) * 0.6, 20);
      
      c.fillStyle = "#e0d7c6";
      c.font = "16px monospace";
      c.fillText("[对决阶段]", canvas.width / 2 - 40, 30);
      c.fillText("你", 30, canvas.height / 2 - 45);
      c.fillText("NPC", 30, canvas.height / 2 + 25);
    }
  };
}

export function createWantedPosterState() {
  return {
    enter(ctx) {
      console.log("[State] WantedPoster enter — defeated:", ctx.npc?.name);
    },
    update(ctx, dt) {
      // Wait for user click to proceed
      return null;
    },
    render(ctx) {
      const { canvas, c } = ctx;
      c.fillStyle = "#2d1f14";
      c.fillRect(0, 0, canvas.width, canvas.height);
      
      // Wanted poster frame
      c.fillStyle = "#5c3d2e";
      c.fillRect(canvas.width / 2 - 150, 50, 300, canvas.height - 100);
      c.fillStyle = "#f5deb3";
      c.fillRect(canvas.width / 2 - 140, 60, 280, canvas.height - 120);
      
      c.fillStyle = "#1a0e05";
      c.font = "bold 28px monospace";
      c.fillText("WANTED", canvas.width / 2 - 60, 110);
      c.font = "18px monospace";
      c.fillText(ctx.npc?.name || "???", canvas.width / 2 - 40, 150);
      c.font = "14px monospace";
      c.fillText("点击继续 →", canvas.width / 2 - 40, canvas.height - 60);
    }
  };
}

export function createGameOverState() {
  return {
    enter(ctx) {
      console.log("[State] GameOver");
    },
    update(ctx, dt) {
      return null;
    },
    render(ctx) {
      const { canvas, c } = ctx;
      c.fillStyle = "rgba(0,0,0,0.8)";
      c.fillRect(0, 0, canvas.width, canvas.height);
      c.fillStyle = "#e74c3c";
      c.font = "bold 32px monospace";
      c.fillText("你输了", canvas.width / 2 - 60, canvas.height / 2 - 20);
      c.fillStyle = "#e0d7c6";
      c.font = "16px monospace";
      c.fillText("点击重试", canvas.width / 2 - 40, canvas.height / 2 + 20);
    }
  };
}
