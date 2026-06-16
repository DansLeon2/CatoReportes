-- 1. Tabla de Usuarios (Médicos, Enfermeros, Administradores)
create table usuarios (
   id              serial primary key,
   nombre_completo varchar(150) not null,
   email           varchar(100) unique not null,
   password        varchar(255) not null,
   rol             varchar(20) not null check ( rol in ( 'admin',
                                             'medico',
                                             'recepcion' ) ),
   especialidad    varchar(100), -- Solo si el rol es 'medico'
   created_at      timestamp default current_timestamp
);

-- 2. Tabla de Pacientes (Información demográfica y de contacto)
create table pacientes (
   id                 serial primary key,
   identificacion     varchar(20) unique not null, -- DNI, Cédula o Pasaporte
   nombre_completo    varchar(150) not null,
   fecha_nacimiento   date not null,
   genero             varchar(20) check ( genero in ( 'Masculino',
                                          'Femenino',
                                          'Otro' ) ),
   telefono           varchar(20),
   email              varchar(100),
   alergias_conocidas text,
   created_at         timestamp default current_timestamp
);

-- 3. Tabla de Citas Médicas (Une al Paciente con el Médico y contiene el Triage)
create table citas_medicas (
   id                     serial primary key,
   paciente_id            integer
      references pacientes ( id )
         on delete cascade,
   medico_id              integer
      references usuarios ( id )
         on delete set null, -- Médico asignado
   fecha_cita             date not null,
   hora_cita              time not null,
   sintomas               text not null,
   prioridad              varchar(10) check ( prioridad in ( 'Alta',
                                                'Media',
                                                'Baja' ) ),
   requiere_asistencia    boolean default false,
   diagnostico_preliminar text,
   estado                 varchar(20) default 'pendiente' check ( estado in ( 'pendiente',
                                                              'atendido',
                                                              'cancelado' ) ),
   created_at             timestamp default current_timestamp
);

-- Índices estratégicos para optimizar las búsquedas de la agenda
create index idx_citas_fecha on
   citas_medicas (
      fecha_cita
   );
create index idx_citas_paciente on
   citas_medicas (
      paciente_id
   );
create index idx_citas_medico on
   citas_medicas (
      medico_id
   );