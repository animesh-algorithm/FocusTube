const TAG = "[FOCUS_TUBE]:";

function toggleComments() {
  const comments = document.querySelector("#comments");
  if (comments) {
    comments.style.display = comments.style.display === "none" ? "" : "none";
    console.log(TAG, "Toggled comments visibility.");
  } else {
    console.log(TAG, "Comments section not found.");
  }
}

function toggleRelatedVideos() {
  const recommendations = document.querySelector("#related");
  if (recommendations) {
    recommendations.style.display =
      recommendations.style.display === "none" ? "" : "none";
    console.log(TAG, "Toggled related videos visibility.");
  } else {
    console.log(TAG, "Related videos section not found.");
  }
}

function toggleDescription() {
  const description = document.querySelector("#description-inner");
  if (description) {
    description.style.display =
      description.style.display === "none" ? "" : "none";
    console.log(TAG, "Toggled description visibility.");
  } else {
    console.log(TAG, "Description section not found.");
  }
}

function toggleChannelInfo() {
  const channel = document.querySelector("#top-row");
  if (channel) {
    channel.style.display = channel.style.display === "none" ? "" : "none";
    console.log(TAG, "Toggled channel info visibility.");
  } else {
    console.log(TAG, "Channel info section not found.");
  }
}

function toggleElements() {
  console.log(TAG, "Toggling elements.");
  toggleComments();
  toggleRelatedVideos();
  toggleDescription();
  toggleChannelInfo();
  document.querySelector("#toggle").innerText === "Hide" ? "Show" : "Hide";
}

function createToggleButton(id, text, onClick) {
  const button = document.createElement("button");
  button.id = id;
  button.innerText = text;
  button.onclick = onClick;
  console.log(TAG, "Button created.");
  return button;
}

function main() {
  console.log(TAG, "Running main function.");

  const button = createToggleButton("toggle", "Hide", toggleElements);
  document.body.appendChild(button);
  console.log(TAG, "Button appended to body.");
}

window.addEventListener("load", () => {
  console.log(TAG, "Window fully loaded.");
  main();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle") {
    toggleElements();
    console.log(TAG, "Received toggle action message.");
  }
});
