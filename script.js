$(document).ready(function () {
    function showErrorIfBlank(inputField, errorElement) {
      if (inputField.val() === "") {
        errorElement.css("visibility", "visible");
        return null; 
      } else {
        errorElement.css("visibility", "hidden");
        return inputField.val(); 
      }
    }
  
    function clearErrorOnInput(inputField, errorElement) {
        inputField.on("input", function () {
          if (inputField.val() !== "") {
            errorElement.css("visibility", "hidden");
          }
        });
      }
    
  
    clearErrorOnInput($("#blockSize"), $("#blockSizeError"));
    clearErrorOnInput($("#mainMemorySize"), $("#mainMemorySizeError"));
    clearErrorOnInput($("#cacheMemorySize"), $("#cacheMemorySizeError"));
    clearErrorOnInput($("#cacheAccessTime"), $("#cacheAccessTimeError"));
    clearErrorOnInput($("#memoryAccessTime"), $("#memoryAccessTimeError"));
    clearErrorOnInput($("#fetchSequence"), $("#fetchSequenceError"));
    clearErrorOnInput($("#numFetch"), $("#numFetchError"));
  
    $("#simulate-button").click(function () {
      var blockSize = showErrorIfBlank($("#blockSize"), $("#blockSizeError"));
      var mainMemorySize = showErrorIfBlank($("#mainMemorySize"), $("#mainMemorySizeError"));
      var mainMemorySizeUnit = $("select[name=mainMemorySizeUnit]").val();
      var cacheMemorySize = showErrorIfBlank($("#cacheMemorySize"), $("#cacheMemorySizeError"));
      var cacheMemorySizeUnit = $("select[name=cacheMemorySizeUnit]").val();
      var cacheAccessTime = showErrorIfBlank($("#cacheAccessTime"), $("#cacheAccessTimeError"));
      var memoryAccessTime = showErrorIfBlank($("#memoryAccessTime"), $("#memoryAccessTimeError"));
      var fetchSequence = showErrorIfBlank($("#fetchSequence"), $("#fetchSequenceError"));
      var fetchSequenceUnit = $("select[name=fetchSequenceUnit]").val();
      var numFetch = showErrorIfBlank($("#numFetch"), $("#numFetchError"));
  
      if (blockSize !== null && mainMemorySize !== null && cacheMemorySize !== null && cacheAccessTime !== null && memoryAccessTime !== null && fetchSequence !== null && numFetch !== null) {
        console.log("Block Size:", blockSize);
        console.log("Main Memory Size:", mainMemorySize, mainMemorySizeUnit);
        console.log("Cache Memory Size:", cacheMemorySize, cacheMemorySizeUnit);
        console.log("Cache Access Time:", cacheAccessTime);
        console.log("Memory Access Time:", memoryAccessTime);
        console.log("Fetch Sequence:", fetchSequence, fetchSequenceUnit);
        console.log("Number of times fetched:", numFetch);
      }
    });
  });
  