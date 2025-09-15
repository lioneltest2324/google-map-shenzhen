let map

function fetchWithXmlHttpRequest(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            let data = JSON.parse(xhr.responseText)
          resolve(data);
        } else {
          reject(new Error('请求失败:' + xhr.status));
        }
      };
      xhr.onerror = function() {
        reject(new Error('请求错误:' + xhr.statusText));
      };
      xhr.send();
    });
  }


async function initMap() {

    // Request needed libraries.
    const data = await fetchWithXmlHttpRequest('https://script.google.com/macros/s/AKfycbyiQ-mK11zsyEQG_Q_16K1d_4NUFTFOZBGRyJoCXm4YnfkIKwsI4lkwCufyqmsnRCVu/exec');


    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { PinElement } = await google.maps.importLibrary("marker");
   


    map = new Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 23.042622432228086, lng: 113.29614507109683 },
        mapId: "DEMO_MAP_ID",
    })



    for (let i = 0; i < data.length; i++) {
        const coordinate = data[i].坐标
        const [lat, lng] = coordinate.split(",")
        const coordinates = { lat: parseFloat(lat), lng: parseFloat(lng) }

        const Tag = document.createElement("div");
        Tag.className = "tag";
        // Tag.textContent = data[i].公司名
        Tag.innerHTML = ` 
        <div class="company-info">
            <span>${data[i].公司名}</span>
        </div>
        <div class="raw-data-1">
            <span class="data-1">薪资：${data[i].薪资}</span>
        </div>
        <div class="raw-data-2">
            <span class="data-2">地址：${data[i].地址具体位置}</span>
        </div>
        <div class="raw-data-3">
            <span class="data-3">推测类目：${data[i].推测类目}</span>
        </div>
        <div class="raw-data-4">
            <span class="data-4">岗位名：${data[i].岗位名}</span>
        </div>
    `;

        const marker = new AdvancedMarkerElement({
            map: map,
            position:coordinates,
            content: Tag,
        })

        marker.addListener("click", () => {
          toggleHighlight(marker);
        })

        function toggleHighlight(markerView) {
          if (markerView.content.classList.contains("highlight")) {
            markerView.content.classList.remove("highlight");
            markerView.zIndex = null;
          } else {
            markerView.content.classList.add("highlight");
            markerView.zIndex = 1;
          }
        }
     }
}

initMap()



