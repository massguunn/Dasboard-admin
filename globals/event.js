document.addEventListener("DOMContentLoaded", () => {
  const packageForm = document.getElementById("package-form-event");
  const packageList = document.getElementById("package-list-event");
  let editingPackageId = null;

  //ambil data yang di server
  async function fetchPackages() {
    const response = await fetch("http://localhost:3000/events");
    const events = await response.json();
    packageList.innerHTML = "";
    events.forEach((pkg) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td> ${pkg.title}</td>
          <td> ${pkg.description}</td>
          <td> ${pkg.location}</td>
          <td> ${pkg.price}</td>
          <td> ${pkg.start_date}</td>
          <td> ${pkg.end_date}</td>
          <td><img src="${pkg.image}" alt="${pkg.image}" width="100"></td>
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
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const location = document.getElementById("location").value;
    const price = document.getElementById("price").value;
    const start_date = document.getElementById("start_date").value;
    const end_date = document.getElementById("end_date").value;
    const image = document.getElementById("image").value;

    const data = {
      title,
      description,
      location,
      price,
      start_date,
      end_date,
      image,
    };
    let method = "POST";
    let url = `http://localhost:3000/events`;
    if (editingPackageId) {
      method = "PUT";
      url = `http://localhost:3000/events/${editingPackageId}`;
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
    const response = await fetch(`http://localhost:3000/events/${id}`);
    const pkg = await response.json();
    document.getElementById("title").value = pkg.title;
    document.getElementById("description").value = pkg.description;
    document.getElementById("location").value = pkg.location;
    document.getElementById("price").value = pkg.price;
    document.getElementById("start_date").value = pkg.start_date;
    document.getElementById("end_date").value = pkg.end_date;
    document.getElementById("image").value = pkg.image;
    editingPackageId = id;
  };

  // Delete package
  window.deletePackage = async (id) => {
    const isConfirmed = window.confirm(
      "Apakah anda yakin inin menghapus Event ini?"
    );

    if (isConfirmed) {
      await fetch(`http://localhost:3000/events/${id}`, {
        method: "DELETE",
      });
      fetchPackages();
    }
  };

  fetchPackages();
});
