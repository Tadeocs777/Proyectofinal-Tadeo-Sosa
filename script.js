let sueldo = 0;
let gastos = [];
let mes = '';

window.onload = function () {
    mostrarMesesGuardados();
    mostrarFormularioMesSueldo();
};

function agregarMes() {
    const mesSelect = document.getElementById("mesSelect");
    const sueldoInput = document.getElementById("sueldoInput");

    mes = mesSelect.value;
    sueldo = parseFloat(sueldoInput.value);

    if (!mes || isNaN(sueldo)) {
        alert("Por favor, ingresa un mes válido y un sueldo.");
        return;
    }

    const mesesGuardados = JSON.parse(localStorage.getItem("mesesGuardados")) || [];
    mesesGuardados.push({ mes, sueldo, gastos });
    localStorage.setItem("mesesGuardados", JSON.stringify(mesesGuardados));

    document.getElementById("agregarGastos").style.display = "block";
    document.getElementById("mesSeleccionado").style.display = "none";
}

function agregarGasto() {
    const nombreGasto = document.getElementById("gastoNombre").value;
    const montoGasto = parseFloat(document.getElementById("gastoMonto").value);
    const divisaGasto = document.getElementById("gastoDivisa").value;
    const clasificacionGasto = document.getElementById("gastoClasificacion").value;

    if (!nombreGasto || isNaN(montoGasto) || !divisaGasto || !clasificacionGasto) {
        alert("Por favor, completa todos los campos del gasto.");
        return;
    }

    gastos.push({ nombre: nombreGasto, monto: montoGasto, divisa: divisaGasto, clasificacion: clasificacionGasto });

    mostrarGastos();

    document.getElementById("gastoNombre").value = '';
    document.getElementById("gastoMonto").value = '';
    document.getElementById("gastoDivisa").value = 'USD';
    document.getElementById("gastoClasificacion").value = 'escencial';
}

function mostrarGastos() {
    const gastosLista = document.getElementById("gastosLista");
    gastosLista.innerHTML = '';

    gastos.forEach(gasto => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${gasto.nombre} - $${gasto.monto} ${gasto.divisa} (${gasto.clasificacion})
            <input type="checkbox" class="checkbox" id="checkbox-${gasto.nombre}" />
        `;
        gastosLista.appendChild(li);
    });
}

function finalizarGastos() {
    let sueldoRestante = sueldo;
    let totalPagar = 0;

    gastos.forEach(gasto => {
        const checkbox = document.getElementById(`checkbox-${gasto.nombre}`);
        if (checkbox && checkbox.checked) {
            totalPagar += gasto.monto;
        }
    });

    sueldoRestante -= totalPagar;

    if (sueldoRestante < 0) {
        alert("No tienes suficiente dinero para cubrir los gastos seleccionados.");
        return;
    }

    const resultado = document.getElementById("resultado");
    resultado.innerHTML = `
        <h4>Resumen de tu mes:</h4>
        <p>Sueldo total: $${formatNumber(sueldo)}</p>
        <p>Total de gastos a pagar: $${formatNumber(totalPagar)}</p>
        <p>Sueldo restante: $${formatNumber(sueldoRestante)}</p>
    `;
    resultado.style.display = 'block';

    document.getElementById("agregarGastos").style.display = "none";
    document.getElementById("mesDetalles").style.display = "none";
}

function mostrarMesesGuardados() {
    const mesesGuardados = JSON.parse(localStorage.getItem("mesesGuardados")) || [];
    const mesesLista = document.getElementById("mesesLista");
    mesesLista.innerHTML = '';

    mesesGuardados.forEach((mesData) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${mesData.mes} - Sueldo: $${formatNumber(mesData.sueldo)}</span>
            <button onclick="verMes(${JSON.stringify(mesData)})">Ver</button>
        `;
        mesesLista.appendChild(li);
    });
}

function verMes(mesData) {
    const mesDetalles = document.getElementById("mesDetalles");
    mesDetalles.innerHTML = `
        <h4>Detalles de ${mesData.mes}:</h4>
        <p>Sueldo: $${formatNumber(mesData.sueldo)}</p>
        <ul>
            ${mesData.gastos.map(gasto => `
                <li>${gasto.nombre} - $${gasto.monto} ${gasto.divisa} (${gasto.clasificacion})</li>
            `).join('')}
        </ul>
    `;
    mesDetalles.style.display = 'block';
}

function formatNumber(number) {
    return number.toLocaleString();
}
