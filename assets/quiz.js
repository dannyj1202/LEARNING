/**
 * Reusable immediate-feedback quiz.
 * Usage:
 *   <div class="quiz" data-quiz data-answer="1" data-ok="…" data-bad="…">
 *     <h3>Check</h3>
 *     <p class="prompt">…</p>
 *     <div class="choices">
 *       <button type="button" class="choice" data-index="0">…</button>
 *       …
 *     </div>
 *     <p class="feedback" aria-live="polite"></p>
 *   </div>
 *   <script src="../assets/quiz.js"></script>
 */
(function () {
  function initQuiz(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = "1";

    var answer = Number(root.dataset.answer);
    var ok = root.dataset.ok || "Correct.";
    var bad = root.dataset.bad || "Not quite — try again after re-reading.";
    var feedback = root.querySelector(".feedback");
    var buttons = Array.prototype.slice.call(root.querySelectorAll("button.choice"));

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var index = Number(btn.dataset.index);
        var correct = index === answer;

        buttons.forEach(function (b) {
          b.disabled = true;
          var i = Number(b.dataset.index);
          if (i === answer) b.classList.add("is-correct");
          else if (i === index && !correct) b.classList.add("is-incorrect");
        });

        if (feedback) {
          feedback.textContent = correct ? ok : bad;
          feedback.className = "feedback " + (correct ? "ok" : "bad");
        }
      });
    });
  }

  function boot() {
    document.querySelectorAll("[data-quiz]").forEach(initQuiz);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
