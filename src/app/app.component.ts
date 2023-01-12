import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonaService } from './services/persona/persona.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  personaForm!: FormGroup;
  personas: any;

  constructor(
    public fb: FormBuilder,
    public personaService: PersonaService,
  ) {

  }
  ngOnInit(): void {

    this.personaForm = this.fb.group({
      /*Los elementos de este formulario deben ser exactamente iguales en los que tenemos en la carpeta de MODELOS del STS*/
      id: [''],
      cedula: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', Validators.required]
    });;

    this.personaService.getAllPersonas().subscribe(resp => {
      this.personas = resp;
    },
      error => { console.error(error) }
    );
  }

  //Metodos para guardar y cargar la informacion a la base de datos o de la persona
  guardar(): void {
    this.personaService.savePersona(this.personaForm.value).subscribe(resp => {
      this.personaForm.reset();
      this.personas = this.personas.filter((persona: { id: any; }) => resp.id !== persona.id);
      this.personas.push(resp);
    },
      error => { console.error(error) }
    )

  }

  eliminar(persona: any) {
    this.personaService.deletePersona(persona.id).subscribe(resp => {
      console.log(resp)
      if (resp === false) {
        this.personas.pop(persona)
      }
    })
  }

  editar(persona: any) {
    this.personaForm.setValue({

      id: persona.id,
      cedula: persona.cedula,
      nombres: persona.nombres,
      apellidos: persona.apellidos,
      telefono: persona.telefono,
      direccion: persona.direccion,
      email: persona.email
    })
  }
}


