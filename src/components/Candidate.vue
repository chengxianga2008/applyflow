<template>
  <v-container fluid>
    <v-form ref="form" v-model="valid">
      <v-col class="mb-5" md="4" offset-md="4">
        <v-row justify="center">
          <v-text-field
            label="First Name"
            hide-details="auto"
            v-model="first_name"
            :rules="text_rules"
          ></v-text-field>
        </v-row>
        <v-row justify="center">
          <v-text-field
            label="Last Name"
            hide-details="auto"
            v-model="last_name"
            :rules="text_rules"
          ></v-text-field>
        </v-row>

        <v-row justify="center">
          <div class="mt-2">
            <label>Skills</label>
          </div>
          <v-layout class="mt-5 checkbox-group" wrap>
            <v-flex v-for="(ele, i) in all_skills" :key="i">
              <v-checkbox
                v-model="skills"
                :label="ele"
                :value="ele"
                :rules="checkbox_rules"
                :hide-details="i == 0 ? 'auto' : true"
              ></v-checkbox>
            </v-flex>
          </v-layout>
        </v-row>
        <v-row class="mt-10" justify="center">
          <v-btn color="red lighten-2" dark v-on:click="updateCandidate">
            Update
          </v-btn>
        </v-row>

        <v-layout>
          <v-snackbar
            v-if="result && result.status_code != 200"
            :timeout="-1"
            :value="true"
            absolute
            color="red accent-4"
            elevation="24"
          >
            {{ result.message }}
          </v-snackbar>

          <v-snackbar
            v-if="result && result.status_code == 200"
            :timeout="-1"
            :value="true"
            absolute
            color="deep-purple accent-4"
            elevation="24"
          >
            Update Successfully.
          </v-snackbar>
        </v-layout>
      </v-col>
    </v-form>
  </v-container>
</template>


<script>
import CandidateApi from "../services/api/Candidate.js";
import SkillApi from "../services/api/Skill.js";
import AuthApi from "../services/api/Auth.js";

export default {
  name: "Candidate",

  data: () => ({
    result: null,
    valid: true,
    skills: [],
    all_skills: [],
    first_name: null,
    last_name: null,
    text_rules: [(value) => !!value || "Required."],
  }),
  computed: {
    checkbox_rules() {
      return [this.skills.length > 0 || "At least one item should be selected"];
    },
  },
  methods: {
    updateCandidate: function (event) {
      this.$refs.form.validate();
      if (this.valid) {
        AuthApi.getToken(process.env.VUE_APP_API_KEY)
          .then((res) => {
            if (res.data && res.data.Token) {
              const params = {
                first_name: this.first_name,
                last_name: this.last_name,
                skills: this.skills,
              };

              CandidateApi.postCandidate(
                this.$route.params.id,
                res.data.Token,
                params
              )
                .then((post_res) => {
                  if (post_res.data) {
                    this.result = post_res.data;
                  }
                })
                .catch((error) => {
                  const res_post = error.response;
                  this.result = res_post.data;
                });
            }
          })
          .catch((error) => {
            const res = error.response;
            this.result = res.data;
          });
      }
    },
  },
  mounted() {
    SkillApi.getSkills()
      .then((res) => {
        if (res.data && res.data.skills) {
          this.all_skills = res.data.skills;
        }
      })
      .catch((error) => {
        const res = error.response;
        switch (res.status) {
          case 422:
            console.log(res.data);
            break;
          default:
        }
      });
  },
  created() {
    CandidateApi.getCandidate(this.$route.params.id)
      .then((res) => {
        if (res.data) {
          this.first_name = res.data.first_name || null;
          this.last_name = res.data.last_name || null;
          this.skills = res.data.skills || [];
        }
      })
      .catch((error) => {
        const res = error.response;
        switch (res.status) {
          case 422:
            console.log(res.data);
            break;
          default:
        }
      });
  },
};
</script>

<style>
.clear {
  clear: both;
}

.checkbox-group .v-messages {
  position: absolute;
  margin-top: 30px;
}
</style>