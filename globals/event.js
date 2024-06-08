document.addEventListener("DOMContentLoaded", () => {
  const packageForm = document.getElementById("package-form");
  const packageList = document.getElementById("package-list");
  let editingPackageId = null;

  //ambil data yang di server
  async function fetchPackages() {
    const response = await fetch("http://localhost:3000/destinations");
    const destinations = await response.json();
    packageList.innerHTML = "";
    destinations.forEach((pkg) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td> ${pkg.name}</td>
          <td> ${pkg.description}</td>
          <td> ${pkg.location}</td>
          <td> ${pkg.rating}</td>
          <td> ${pkg.price}</td>
          <td><img src="${pkg.image_url}" alt="${pkg.image_url}" width="200"></td>
          <td class="action">
              <button class="edit" onclick="editPackage(${pkg.id})">Edit</button>
              <button class="delete" onclick="deletePackage(${pkg.id})">Delete</button>
        </td>
               `;
      packageList.appendChild(row);
    });
  }

  // tambahkan atau update data
  packageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const location = document.getElementById("location").value;
    const rating = document.getElementById("rating").value;
    const price = document.getElementById("price").value;
    const image_url = document.getElementById("image_url").value;

    const data = { name, description, location, rating, price, image_url };
    let method = "POST";
    let url = `http://localhost:3000/destinations`;
    if (editingPackageId) {
      method = "PUT";
      url = `http://localhost:3000/destinations/${editingPackageId}`;
    }

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    packageForm.reset();
    editingPackageId = null;
    fetchPackages();
  });

  // Edit package
  window.editPackage = async (id) => {
    const response = await fetch(`http://localhost:3000/destinations/${id}`);
    const pkg = await response.json();
    document.getElementById("name").value = pkg.name;
    document.getElementById("description").value = pkg.description;
    document.getElementById("location").value = pkg.location;
    document.getElementById("rating").value = pkg.rating;
    document.getElementById("price").value = pkg.price;
    document.getElementById("image_url").value = pkg.image_url;
    editingPackageId = id;
  };

  // Delete package
  window.deletePackage = async (id) => {
    await fetch(`http://localhost:3000/destinations/${id}`, {
      method: "DELETE",
    });
    fetchPackages();
  };

  fetchPackages();
});
